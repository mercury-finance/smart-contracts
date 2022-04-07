# Interaction example

### Deposit

Assume user has some aBNBc tokens.

aBNBc is ERC20 complaint contract. 

1. Approve aBNBc with deposit amount against interaction contract
2. Call `interaction.deposit(<amount>)`

### Borrow

1. Call `interaction.borrow(<amount_to_borrow>)`

Check that you have USB present in the wallet


### Repay

1. Approve USB (it is also ERC20 complaint contract) against interaction
2. Call `interaction.payback(<amount_of_usb>)`

Note: aBNBc will stay collaterized(locked) in the vault.

### Withdraw
Unlock and transfer funds to the user

1. Call `interaction.withdraw(<abnbc_amount_to_withdraw>)`

## View functions

* `locked(<user_address>)` - Amount of aBNBc in collateral for a user
* `borrowed(<user_address>)` - Amount of USB borrowed by user
* `collateralPrice()` - price of the collateral asset(aBNBc) from Oracle
* `usbPrice()` - USB price
* `collateralRate` - how much USB user can borrow for one token of collateral<br> 
                     i.e. 1 aBNBc worth `collateralRate` USB
* `depositTVL()` - Total aBNBc deposited nominated in $
* `collateralTVL()` - Total USB borrowed by all users
* `availableToBorrow(<user_address>)` - Collateral minus borrowed. In other words: free collateral (nominated in USB)
* `willBorrow(<user_address>, <amount>)` - Collateral minus borrowed with additional amount of aBNBc (`amount` can be negative).
* `currentLiquidationPrice(<user_address>)` - Price of aBNBc when user will be liquidated
* `estimatedLiquidationPrice(<user_address>, <amount>)` - Price of aBNBc when user will be liquidated with additional amount of aBNBc deposited/withdraw

## ABIs
[INTERACTION ABI](interfaces/DAOInteraction.json)

[IERC20 ABI](interfaces/IERC20.json)

## Addresses

* "INTERACTION": [0x96cDdE62c8BA5D21572D715DA03f5330e6C77dC8](https://testnet.bscscan.com/address/0x96cDdE62c8BA5D21572D715DA03f5330e6C77dC8),
* "mock aBNBc": [0x34e31dBCDd0866B90C4d2F3a3572C7Ce7918088f](https://testnet.bscscan.com/address/0x34e31dBCDd0866B90C4d2F3a3572C7Ce7918088f),
* "REAL aBNBc": [0x46dE2FBAf41499f298457cD2d9288df4Eb1452Ab](https://testnet.bscscan.com/address/0x46dE2FBAf41499f298457cD2d9288df4Eb1452Ab),
* "USB": [0x2b897B577d5277C056d763B58b93F718e2A9d7d6](https://testnet.bscscan.com/address/0x2b897B577d5277C056d763B58b93F718e2A9d7d6),

## String to bytes32

https://ethereum.stackexchange.com/a/23110

`web3.utils.hexToAscii(val)`