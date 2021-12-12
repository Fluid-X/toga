import { Bytes, ethereum } from "@graphprotocol/graph-ts"
import { PIC } from "../generated/schema"

export function getEventId(event: ethereum.Event): string {
	return event.transaction.hash
		.toHex()
		.concat("-")
		.concat(event.logIndex.toString())
}

export function getPicId(token: Bytes, account: Bytes): string {
    return token.toString().concat("-").concat(account.toString())
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
