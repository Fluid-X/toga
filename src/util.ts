import { BigInt, Bytes, ethereum, Address, log } from "@graphprotocol/graph-ts"

export function createEventId(event: ethereum.Event): string {
	return event.transaction.hash
		.toHex()
		.concat("-")
		.concat(event.logIndex.toString())
}

export function getPicId(token: string, account: string): string {
    return token.concat("-").concat(account)
}

// export function getOrInitExitRateEntity(){}
