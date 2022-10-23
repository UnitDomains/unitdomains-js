export type SupportedNetworkId = 1 | 5

export const convert2SupportedNetworkId = (n: number): SupportedNetworkId => {
  switch (n) {
    case 1:
    case 5:
      return n
    default:
      throw new Error('error on type convertion')
  }
}

export type ContractName =
  | 'BaseRegistrar'
  | 'ETHRegistrarController'
  | 'PublicResolver'
  | 'ENSRegistry'
  | 'ReverseRegistrar'
  | 'Price'
  | 'SubDomain'

export const emptyAddress = '0x0000000000000000000000000000000000000000'

export const GRACE_PERIOD = 86400 * 90
export const PREMIUM_PERIOD = 86400 * 28
export const YearInSeconds = 31556952
