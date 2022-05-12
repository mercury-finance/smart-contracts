// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IVault.sol";
import "./interfaces/ICertToken.sol";

contract CeVault is
    IVault,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    /**
     * Variables
     */

    string private _name;

    uint256 private _initRatio;
    uint256 private _currentRatio;

    // Tokens
    ICertToken private _ceToken;
    ICertToken private _aBNBc;

    address private _router;

    mapping(address => uint256) private _claimed; // in aBNBc
    mapping(address => uint256) private _depositors; // in aBNBc
    mapping(address => uint256) private _ceTokenBalances; // in aBNBc

    /**
     * Modifiers
     */

    modifier onlyRouter() {
        require(msg.sender == _router, "Not allowed: your are not router");
        _;
    }

    function initialize(
        string memory name,
        address ceTokenAddress,
        address aBNBcAddress
    ) external initializer {
        __Ownable_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        _name = name;
        _ceToken = ICertToken(ceTokenAddress);
        _aBNBc = ICertToken(aBNBcAddress);
        _currentRatio = ICertToken(_aBNBc).ratio();
    }

    // deposit
    function deposit(address recipient, uint256 amount)
        external
        override
        nonReentrant
        returns (uint256)
    {
        _aBNBc.transferFrom(msg.sender, address(this), amount);
        uint256 toMint = (amount * 1e18) / _currentRatio;
        // add profit as other part of yield(yield includes profit before the first claim)
        _depositors[recipient] += amount;
        _ceTokenBalances[recipient] += toMint;
        //  mint ceToken to recipient
        ICertToken(_ceToken).mint(recipient, toMint);
        emit Deposited(msg.sender, recipient, toMint);
        return toMint;
    }

    function claimYieldsFor(address owner, address recipient)
        external
        override
        onlyRouter
        returns (uint256)
    {
        return claimYields(owner, recipient);
    }

    // claimYields
    function claimYields(address recipient)
        external
        override
        nonReentrant
        returns (uint256)
    {
        return claimYields(msg.sender, recipient);
    }

    function claimYields(address owner, address recipient)
        private
        returns (uint256)
    {
        uint256 availableYields = this.getYieldFor(owner);
        require(availableYields > 0, "hasn't got yields to claim");
        // return back aBNBc to recipient
        _aBNBc.transfer(recipient, availableYields);
        _claimed[owner] += availableYields;
        // update profit -> 0
        emit Claimed(owner, recipient, availableYields);
        return availableYields;
    }

    // withdrawal
    function withdrawal(address recipient, uint256 amount)
        external
        override
        nonReentrant
        returns (uint256)
    {
        uint256 realAmount = (amount * _currentRatio) / 1e18;
        require(
            _aBNBc.balanceOf(address(this)) >= realAmount,
            "not such amount in the vault"
        );
        uint256 balance = _ceTokenBalances[msg.sender];
        require(balance >= amount, "insufficient balance");
        _ceTokenBalances[msg.sender] -= amount;
        // burn ceToken from owner
        ICertToken(_ceToken).burn(msg.sender, amount);
        _depositors[msg.sender] -= realAmount;
        _aBNBc.transfer(recipient, realAmount);
        emit Withdrawn(msg.sender, recipient, realAmount);
        return realAmount;
    }

    function updateRatio() external override {
        _currentRatio = ICertToken(_aBNBc).ratio();
        emit RatioUpdated(_currentRatio);
    }

    function getTotalAmountInVault() external view override returns (uint256) {
        return _aBNBc.balanceOf(address(this));
    }

    // yield + principal = deposited(before claim)
    // BUT after claim yields: available_yield + principal == deposited - claimed
    // available_yield = yield - claimed;

    // principal = deposited*(current_ratio/init_ratio)=cetoken.balanceOf(account)*current_ratio;
    function getPrincipalOf(address account)
        external
        view
        override
        returns (uint256)
    {
        return (_ceTokenBalances[account] * _currentRatio) / 1e18; // in aBNBc
    }

    // yield = deposited*(1-current_ratio/init_ratio) = cetoken.balanceOf*init_ratio-cetoken.balanceOf*current_ratio
    // yield = cetoken.balanceOf*(init_ratio-current_ratio) = amount(in aBNBc) - amount(in aBNBc)
    function getYieldFor(address account)
        external
        view
        override
        returns (uint256)
    {
        uint256 principal = this.getPrincipalOf(account);
        uint256 totalYields = _depositors[account] - principal;
        if (totalYields <= _claimed[account]) {
            return 0;
        }
        return totalYields - _claimed[account];
    }

    function getCeTokenBalanceOf(address account)
        external
        view
        returns (uint256)
    {
        return _ceTokenBalances[account];
    }

    function getDepositOf(address account) external view returns (uint256) {
        return _depositors[account];
    }

    function getClaimedOf(address account) external view returns (uint256) {
        return _claimed[account];
    }

    function ratio() external view override returns (uint256) {
        return _currentRatio;
    }

    function changeRouter(address router) external onlyOwner {
        _router = router;
        emit RouterChanged(router);
    }

    function getName() external view returns (string memory) {
        return _name;
    }
}
