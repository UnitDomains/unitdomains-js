import { SupportedNetworkId, ContractName } from '../models/types'

const CONTRACT_ADDRESS: Record<
  SupportedNetworkId,
  Partial<Record<ContractName, string>>
> = {
  // Mainnet
  1: {
    ENSRegistry: '0x0000000009165d4dB3321a666Fe86A59c415FfCE',
    Price: '0xf6e6CD1fdF114c4b4B82eeF5C0814E18BC7DBD39',
    SubDomain: '0xD85E2A312B88BDbb76DbE8012Eb4Ac0119f0E93B',
  },

  // Goerli test network
  5: {
    ENSRegistry: '0x0000000009165d4dB3321a666Fe86A59c415FfCE',
    Price: '0x017e9eeA60BE8B396E5208E94905B812f6B6D234',
    SubDomain: '0xD85E2A312B88BDbb76DbE8012Eb4Ac0119f0E93B',
  },
}

function getContractAddress(networkId: SupportedNetworkId, key: ContractName) {
  try {
    return CONTRACT_ADDRESS[networkId][key]
  } catch {
    throw new Error(`No address for contract ${key} on network ${networkId}`)
  }
}

export function getEnsContractAddress(networkId: SupportedNetworkId) {
  return getContractAddress(networkId, 'ENSRegistry')
}

export function getPriceContractAddress(networkId: SupportedNetworkId) {
  return getContractAddress(networkId, 'Price')
}

export function getSubdomainContractAddress(networkId: SupportedNetworkId) {
  return getContractAddress(networkId, 'SubDomain')
}
