# Interaction example

### Deposit

Assume user has some aBNBc tokens.

aBNBc is ERC20 complaint contract. 

1. Approve aBNBc with deposit amount against interaction contract
2. Call `interaction.deposit(<amount>)`

### Borrow

~~1. Get `vat` contract address from interaction.~~ No more needed

~~2. Call vat.hope(<interaction_address>)~~

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

* "INTERACTION": [0xcB5E47a564C5f88a6652D095A3D5b010D03940aB](https://testnet.bscscan.com/address/0xcB5E47a564C5f88a6652D095A3D5b010D03940aB),
* "aBNBc": [0x43529c21Cd98870B5693b9081391D938EE54E240](https://testnet.bscscan.com/address/0x43529c21Cd98870B5693b9081391D938EE54E240),
* "USB": [0x2C9120b9Fc23e93Eb3ff887FC4CDc3AFB3869F09](https://testnet.bscscan.com/address/0x2C9120b9Fc23e93Eb3ff887FC4CDc3AFB3869F09),