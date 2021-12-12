import { BigInt } from "@graphprotocol/graph-ts"
import {
	TOGA,
	ExitRateChanged as ExitRateChangedEvent,
	NewPIC as NewPICEvent
} from "../generated/TOGA/TOGA"
import { ExitRateChanged } from "../generated/schema"
import { getEventId, getOrInitPic, getPicId } from "./util"

export function handleNewPIC(event: NewPICEvent): void {
	let { number, timestamp } = event.block

	let eventId = getEventId(event)
	let erc = new ExitRateChanged(eventId)
	erc.blockNumber = number
	erc.timestamp = timestamp
	erc.transactionHash = event.transaction.hash
	erc.token = event.params.token
	erc.oldExitRate = new BigInt(0)
	erc.newExitRate = event.params.exitRate
	erc.pic = getPicId(event.params.token, event.params.pic)
	erc.save()

	let pic = getOrInitPic(event.params.token, event.params.pic)
	pic.exitRate = event.params.exitRate
	pic.becamePICTimestamp = timestamp
	pic.lastUpdateTimestamp = timestamp
	pic.becamePICBlock = number
	pic.lastUpdateBlock = number
	pic.active = true
	pic.exitRateChanges = [eventId]
	pic.save()
}

export function handleExitRateChanged(event: ExitRateChangedEvent): void {
	const eventId = getEventId(event)
	const { address, params, block, transaction } = event
	const account = TOGA.bind(address).getCurrentPICInfo(params.token).value0

	let pic = getOrInitPic(params.token, account)
	pic.exitRateChanges.push(eventId)
	pic.save()
	
	let erc = new ExitRateChanged(getEventId(event))
	erc.blockNumber = block.number
	erc.timestamp = block.timestamp
	erc.transactionHash = transaction.hash
	erc.token = params.token
	erc.pic = getPicId(params.token, account)
	erc.oldExitRate = pic.exitRate
	erc.newExitRate = params.exitRate
	erc.save()
}
