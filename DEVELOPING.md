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

### View functions

* `interaction.locked(<user_address>)` - Amount of aBNBc in collateral for a user
* `interaction.borrowed(<user_address>)` - Amount of USB borrowed by user

## ABIs
[INTERACTION ABI](interfaces/DAOInteraction.json)

[IERC20 ABI](interfaces/IERC20.json)

## Addresses

* "VAT": "0xf31dbdB4F009a0c064820d1310B3748377E94405", -- you can use this address instead of retrieving it from interaction
* "INTERACTION": "0x7DCc00D49aE0f908d80b8894aD4A19105e1f6483",
* "aBNBc": "0x43529c21Cd98870B5693b9081391D938EE54E240",
* "USB": "0x2C9120b9Fc23e93Eb3ff887FC4CDc3AFB3869F09",