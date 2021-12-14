import { BigInt } from "@graphprotocol/graph-ts"
import {
	TOGA,
	ExitRateChanged,
	NewPIC
} from "../generated/TOGA/TOGA"
import { ExitRateChangedEvent, NewPICEvent } from "../generated/schema"
import { getEventId, getOrInitPic, getPicId } from "./util"

export function handleNewPic(event: NewPIC): void {
	const ercEventId = getEventId(event, 'ExitRateChanged')
	const newPicEventId = getEventId(event, 'NewPIC')
	let newPicEvent = new NewPICEvent(newPicEventId)
	let ercEvent = new ExitRateChangedEvent(ercEventId)
	let pic = getOrInitPic(event.params.token, event.params.pic)

	// EXIT RATE CHANGED EVENT
	ercEvent.blockNumber = event.block.number
	ercEvent.timestamp = event.block.timestamp
	ercEvent.transactionHash = event.transaction.hash
	ercEvent.token = event.params.token
	ercEvent.oldExitRate = new BigInt(0)
	ercEvent.newExitRate = event.params.exitRate
	ercEvent.pic = getPicId(event.params.token, event.params.pic)
	ercEvent.save()

	// NEW PIC EVENT
	newPicEvent.blockNumber = event.block.number
	newPicEvent.timestamp = event.block.timestamp
	newPicEvent.transactionHash = event.transaction.hash
	newPicEvent.token = event.params.token
	newPicEvent.bond = event.params.bond
	newPicEvent.exitRate = event.params.exitRate
	newPicEvent.lastPic = pic.id

	// PIC ENTITY
	pic.exitRate = event.params.exitRate
	pic.becamePICTimestamp = event.block.timestamp
	pic.lastUpdateTimestamp = event.block.timestamp
	pic.becamePICBlock = event.block.number
	pic.lastUpdateBlock = event.block.number
	pic.active = true
	pic.exitRateChanges = [ercEventId]
	pic.save()

	// NEW PIC IN NEW PIC EVENT UPDATE
	newPicEvent.newPic = pic.id
}

export function handleExitRateChanged(event: ExitRateChanged): void {
	const ercEventId = getEventId(event, 'ExitRateChanged')
	const account = TOGA.bind(event.address).getCurrentPICInfo(event.params.token).value0

	let pic = getOrInitPic(event.params.token, account)
	pic.exitRateChanges.push(ercEventId)
	pic.save()

	let ercEvent = new ExitRateChangedEvent(ercEventId)
	ercEvent.blockNumber = event.block.number
	ercEvent.timestamp = event.block.timestamp
	ercEvent.transactionHash = event.transaction.hash
	ercEvent.token = event.params.token
	ercEvent.pic = getPicId(event.params.token, account)
	ercEvent.oldExitRate = pic.exitRate
	ercEvent.newExitRate = event.params.exitRate
	ercEvent.save()
}
