// NOT UPDATED SINCE SCHEMA AND MANIFEST UPDATE

import { Bytes, ethereum } from "@graphprotocol/graph-ts"
import { PIC } from "../generated/schema"

type EventLabel = "ExitRateChanged" | "NewPIC"

export function getEventId(event: ethereum.Event, label: EventLabel): string {
	return event.transaction.hash
		.toHex()
		.concat("-")
		.concat(event.logIndex.toHex())
		.concat("-")
		.concat(label)
}

export function getPicId(token: Bytes, account: Bytes): string {
	return token
		.toHex()
		.concat("-")
		.concat(account.toHex())
}

export function getOrInitPic(token: Bytes, account: Bytes): PIC {
	const picId = getPicId(token, account)
	let pic = PIC.load(picId)
	if (pic === null) {
		pic = new PIC(picId)
		pic.account = account
		pic.token = token
	}
	return pic
}
