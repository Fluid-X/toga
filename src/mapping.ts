import { BigInt } from "@graphprotocol/graph-ts"
import {
	TOGA,
	ExitRateChanged as ExitRateChangedEvent,
	NewPIC
} from "../generated/TOGA/TOGA"
import { ExitRateChanged } from "../generated/schema"
import { createEventId, getPicId } from "./util"

export function handleNewPIC(event: NewPIC): void {

}

export function handleExitRateChanged(event: ExitRateChangedEvent): void {
	let ev = new ExitRateChanged(createEventId(event))
	let toga = TOGA.bind(event.address)
	let pic = toga.getCurrentPIC(event.params.token)
	ev.blockNumber = event.block.number
	ev.timestamp = event.block.timestamp
	ev.transactionHash = event.transaction.hash
	ev.token = event.params.token
	ev.newExitRate = event.params.exitRate
	ev.pic = pic
}

// export function handleExitRateChangedOld(event: ExitRateChanged): void {
//   // Entities can be loaded from the store using a string ID; this ID
//   // needs to be unique across all entities of the same type
//   let entity = ExampleEntity.load(event.transaction.from.toHex())

//   // Entities only exist after they have been saved to the store;
//   // `null` checks allow to create entities on demand
//   if (!entity) {
//     entity = new ExampleEntity(event.transaction.from.toHex())

//     // Entity fields can be set using simple assignments
//     entity.count = BigInt.fromI32(0)
//   }

//   // BigInt and BigDecimal math are supported
//   entity.count = entity.count + BigInt.fromI32(1)

//   // Entity fields can be set based on event parameters
//   entity.token = event.params.token
//   entity.exitRate = event.params.exitRate

//   // Entities can be written to the store with `.save()`
//   entity.save()

//   // Note: If a handler doesn't require existing field values, it is faster
//   // _not_ to load the entity from the store. Instead, create it fresh with
//   // `new Entity(...)`, set the fields that should be updated and save the
//   // entity back to the store. Fields that were not set or unset remain
//   // unchanged, allowing for partial updates to be applied.

//   // It is also possible to access smart contracts from mappings. For
//   // example, the contract that has emitted the event can be connected to
//   // with:
//   //
//   // let contract = Contract.bind(event.address)
//   //
//   // The following functions can then be called on this contract to access
//   // state variables and other data:
//   //
//   // - contract.ERC777_SEND_GAS_LIMIT(...)
//   // - contract.getCurrentPIC(...)
//   // - contract.getCurrentPICInfo(...)
//   // - contract.getDefaultExitRateFor(...)
//   // - contract.getMaxExitRateFor(...)
//   // - contract.minBondDuration(...)
// }
