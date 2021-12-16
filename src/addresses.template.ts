import { Address } from '@graphprotocol/graph-ts'

export function getHostAddress(): Address {
    return Address.fromString('{{ hostAddress }}')
}

export function getResolverAddress(): Address {
    return Address.fromString('{{ resolverV1Address }}')
}
