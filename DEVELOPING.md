# Interaction example

### Deposit

Assume user has some aBNBc tokens.

aBNBc is ERC20 complaint contract. 

1. Approve aBNBc(token) with deposit amount against interaction contract
2. Call `interaction.deposit(<token>, <amount>)`

### Borrow

1. Call `interaction.borrow(<token>, <amount_to_borrow>)`
`Token` is the collateral token that you want to use
Check that you have USB present in the wallet


### Repay

1. Approve USB (it is also ERC20 complaint contract) against interaction
2. Call `interaction.payback(<token>, <amount_of_usb>)`

Note: aBNBc will stay collaterized(locked) in the vault.

### Withdraw
Unlock and transfer funds to the user

1. Call `interaction.withdraw(<token>, <abnbc_amount_to_withdraw>)`

## View functions

* `locked(<token>, <user_address>)` - Amount of aBNBc in collateral for a user
* `borrowed(<token>, <user_address>)` - Amount of USB borrowed by user
* `collateralPrice(<token>)` - price of the collateral asset(aBNBc) from Oracle
* `usbPrice(<token>)` - USB price
* `collateralRate(<token>)` - how much USB user can borrow for one token of collateral<br> 
                     i.e. 1 aBNBc worth `collateralRate` USB
* `depositTVL(<token>)` - Total aBNBc deposited nominated in $
* `collateralTVL(<token>)` - Total USB borrowed by all users
* `availableToBorrow(<token>, <user_address>)` - Collateral minus borrowed. In other words: free collateral (nominated in USB)
* `willBorrow(<token>, <user_address>, <amount>)` - Collateral minus borrowed with additional amount of aBNBc (`amount` can be negative).
* `currentLiquidationPrice(<token>, <user_address>)` - Price of aBNBc when user will be liquidated
* `estimatedLiquidationPrice(<token>, <user_address>, <amount>)` - Price of aBNBc when user will be liquidated with additional amount of aBNBc deposited/withdraw
* `borrowApr(<token>)` - Percent value, yearly APY with 6 decimals

## ABIs
[INTERACTION ABI](interfaces/DAOInteraction.json)

[IERC20 ABI](interfaces/IERC20.json)

## Addresses

* "INTERACTION": [0xfA792b240a196123A9a5C98514185E61290B5eed](https://testnet.bscscan.com/address/0xfA792b240a196123A9a5C98514185E61290B5eed),
* "mock aBNBc": [0x34e31dBCDd0866B90C4d2F3a3572C7Ce7918088f](https://testnet.bscscan.com/address/0x34e31dBCDd0866B90C4d2F3a3572C7Ce7918088f),
* "REAL aBNBc": [0x46dE2FBAf41499f298457cD2d9288df4Eb1452Ab](https://testnet.bscscan.com/address/0x46dE2FBAf41499f298457cD2d9288df4Eb1452Ab),
* "USB": [0x2b897B577d5277C056d763B58b93F718e2A9d7d6](https://testnet.bscscan.com/address/0x2b897B577d5277C056d763B58b93F718e2A9d7d6),

## String to bytes32

https://ethereum.stackexchange.com/a/23110

`web3.utils.hexToAscii(val)`