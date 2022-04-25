// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./hMAth.sol";

interface VatLike {
    function ilks(bytes32) external returns (
        uint256 Art,   // [wad]
        uint256 rate   // [ray]
    );
    function fold(bytes32,address,int) external;
}

interface Oracle {
    function peek() external view returns (bytes32, bool);
}

interface Mintable {
    function mint(address _to, uint256 _amount) external returns(bool);
}

contract HelioRewards {
    // --- Auth ---
    mapping (address => uint) public wards;
    function rely(address usr) external auth { require(live == 1, "Rewards/not-live"); wards[usr] = 1; }
    function deny(address usr) external auth { require(live == 1, "Rewards/not-live"); wards[usr] = 0; }
    modifier auth {
        require(wards[msg.sender] == 1, "Rewards/not-authorized");
        _;
    }

    uint256 constant ONE = 10 ** 27; // ray
    uint256 public live;  // Active Flag

    // --- Data ---
    struct Ilk {
        uint256 rewardRate;  // Collateral-specific, per-second reward rate [ray]
        uint256 rho;  // Time of last drip [unix epoch time]
    }

    modifier poolInit {
        require(ilks[ilk].rho != 0, "Reward/not-init");
        _;
    }

    event Claimed(address indexed user, uint256 amount);

    mapping (address => uint256) unclaimedRewards;
    mapping (address => uint256) claimedRewards;
    mapping (bytes32 => Ilk) ilks;
    VatLike                  public vat; // CDP engine
    address public helioToken;

    bytes32 poolIlk;
    uint256 rewardsPool;

    constructor() {
        live = 1;
        wards[msg.sender] == 1;
    }

    function stop() public auth {
        live = 0;
    }

    function initPool(bytes32 ilk) {
        ilks[ilk] = Ilk(0, block.timestamp);
        poolIlk = ilk;
    }

    function helioPrice() public view returns(uint256) {
        return 100000000000000000; //FIXME: HARDCODED 10 cents
    }

    function pendingRewards(address usr) public poolInit view returns(uint256) {
        (,uint256 rate,,,) = vat.ilks(poolIlk);
        (, uint256 art) = vat.urns(poolIlk, usr);
        uint256 usrDebt = hMath.mulDiv(art, rate, 10 ** 27);
        (uint256 totalDebt, uint256 rate) = vat.ilks(poolIlk);
        uint256 shares = hMath.mulDiv(usrDebt, rewardsPool, totalDebt);
        return unclaimedRewards[usr] + shares - claimedRewards[usr];
    }

    function withDraw(address usr, uint256 dart) external poolInit auth {
        (uint256 totalDebt,) = vat.ilks(poolIlk);
        uint256 shares = hMath.mulDiv(dart, rewardsPool, totalDebt);
        rewardsPool -= shares;
        unclaimedRewards[usr] += shares;
    }

    function claim(address usr, uint256 amount) external poolInit auth {
        require(amount <= pendingRewards(usr), "Rewards/not-enough-rewards");
        if (unclaimedRewards[usr] >= amount) {
            unclaimedRewards[usr] -= amount;
        } else {
            uint256 diff = amount - unclaimedRewards[usr];
            claimedRewards[usr] = diff;
            unclaimedRewards[usr] = 0;
        }
        Mintable(helioToken).mint(usr, amount);

        emit Claimed(usr, amount);
    }

    // Rewards pool update
    function drip(bytes32 ilk) external poolInit {
        require(block.timestamp >= ilks[ilk].rho, "Reward/invalid-now");
        rate = hMath._rpow(ilks[ilk].rewardRate, block.timestamp - ilks[ilk].rho, ONE);
        ilks[ilk].rho = block.timestamp;

        (uint256 totalDebt,) = vat.ilks(poolIlk);
        uint256 rewards = hMath.mulDiv(rate, totalDebt, 10 ** 27); //$ amount
        rewardsPool += hMath.muldiv(rewards , helioPrice, 10 ** 18);
    }
}