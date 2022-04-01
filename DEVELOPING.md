# Interaction example

### Deposit

Assume user has some aBNBc tokens.

aBNBc is ERC20 complaint contract. 

1. Approve aBNBc with deposit amount against interaction contract
2. Call `interaction.deposit(<amount>)`

### Borrow

1. Get `vat` contract address from interaction.
2. Call `vat.hope(<interaction_address>)`
3. Call `interaction.addCollateralAndBorrow(<amount_to_collaterize>, <amount_to_borrow>)`

Check that you have USB present in the wallet


### Repay

1. Approve USB (it is also ERC20 complaint contract) against interaction
2. Call `interaction.payback(<amount_of_usb>)`

Note: aBNBc will stay collaterized(locked) in the vault.

### Withdraw
Unlock and transfer funds to the user

1. Call `interaction.withdraw(<abnbc_amount_to_withdraw>)`


## ABIs
[INTERACTION ABI](interfaces/DAOInteraction.json)

[VAT ABI](interfaces/VatHope.json)

[IERC20 ABI](interfaces/IERC20.json)

## Addresses

* "VAT": "0x7FcCa90fC59a7102c726E52DB76BB308DAe48B0B", -- you can use this address instead of retrieving it from interaction
* "INTERACTION": "0xbB8115E03653080C24cc74e95B2Bc7C29b68A334",
* "aBNBc": "0x6E9F279cCEc00a245535EDa5775a9Af96c4BadCC",
* "USB": "0x73256b30025de0d7CE2Ad814ec9E3A5719F371CA",