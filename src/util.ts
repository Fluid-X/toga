import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { PIC, SuperToken } from "../generated/schema"
import { SuperToken as SuperTokenTemplate } from "../generated/templates"
import { ISuperToken } from "../generated/templates/SuperToken/ISuperToken"
import { Resolver } from "../generated/templates/SuperToken/Resolver"
import { getResolverAddress } from "./addresses"

// ID GENERATORS
export function getEventId(event: ethereum.Event, label: string): string {
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

// ENTITY GETTERS/SETTERS
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

export function getOrInitSuperToken(
	address: Address,
	block: ethereum.Block
): SuperToken {
	const superTokenId = address.toHex()
	const resolver = getResolverAddress()
	let superToken = SuperToken.load(superTokenId)
	if (superToken === null) {
		superToken = new SuperToken(superTokenId)
		superToken.createdAtTimestamp = block.timestamp
		superToken.createdAtBlockNumber = block.number
		superToken.decimals = 18
		superToken = getSuperTokenMetadata(superToken, address)
		superToken = getIsListed(superToken, address, resolver)
		superToken.save()

		SuperTokenTemplate.create(address)

		return superToken
	}
	if (superToken.name.length === 0 || superToken.symbol.length) {
		superToken = getSuperTokenMetadata(superToken, address)
		superToken.save()
	}
	if (!superToken.isListed) {
		superToken = getIsListed(superToken, address, resolver)
	}
	// ISuperToken.create()
	return superToken
}

// HELPERS
function getSuperTokenMetadata(
	superToken: SuperToken,
	address: Address
): SuperToken {
	const contract = ISuperToken.bind(address)
	const nameResult = contract.try_name()
	const symbolResult = contract.try_symbol()
	const decimalsResult = contract.try_decimals()
	const underlyingAddress = contract.try_getUnderlyingToken()
	superToken.name = !nameResult.reverted ? nameResult.value : ""
	superToken.symbol = !symbolResult.reverted ? symbolResult.value : ""
	superToken.decimals = !decimalsResult.reverted ? decimalsResult.value : 0
	superToken.underlyingAddress = !underlyingAddress.reverted
		? underlyingAddress.value
		: new Address(0)
	return superToken
}

function getIsListed(
	superToken: SuperToken,
	address: Address,
	resolver: Address
): SuperToken {
	const contract = Resolver.bind(resolver)
	const version =
		resolver.toHex() == "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
			? "test"
			: "v1"
	// "supertokens.v1.MATICx" -> __MATICx_ADDRESS__
	const tokenString = "supertokens."
		.concat(version)
		.concat(".")
		.concat(superToken.symbol)
	const result = contract.try_get(tokenString)
	const superTokenAddress = !result.reverted ? result.value : new Address(0)
	superToken.isListed = address.toHex() == superTokenAddress.toHex()
	return superToken
}


