import { ethers, Contract } from 'ethers'
import { SupportedNetworkId, emptyAddress } from './types'
import { getEnsContractAddress } from '../contracts/addressConfig'

import {
  getENSContract,
  getResolverContract,
  getRegistrarContract,
  getRegistrarControllerContract,
} from '../contracts'
import { namehash } from '../utils/normalize'

export const interfaces = {
  permanentRegistrar: '0x018fac06',
  permanentRegistrarWithConfig: '0xca27ac4c',
  baseRegistrar: '0x6ccb2df4',
}

export class ENSRegistry {
  protected ENS: Contract

  public provider: ethers.providers.JsonRpcProvider

  public ensContractAddress: string

  constructor(
    networkId: SupportedNetworkId,
    provider: ethers.providers.JsonRpcProvider,
  ) {
    const contractAddress = getEnsContractAddress(networkId)
    if (typeof contractAddress === 'undefined')
      throw new Error(`No address for ENSRegistry on network ${networkId}`)

    this.ensContractAddress = contractAddress

    this.provider = provider

    //  console.log("registryAddress:" + registryAddress)

    const ENSContract = getENSContract(contractAddress, provider)
    this.ENS = ENSContract
  }

  async getRegistrarContract() {
    const registrarAddress = await this.ENS.owner(namehash('unit'))

    return getRegistrarContract(registrarAddress, this.provider)
  }

  async getPublicResolverContract() {
    const resolverAddr = await this.ENS.resolver(namehash('unit'))

    return getResolverContract(resolverAddr, this.provider)
  }

  async getControllerContract() {
    const controllerAddr = await this.getControllerAddress()

    return getRegistrarControllerContract(controllerAddr, this.provider)
  }

  async getControllerAddress() {
    const Resolver = await this.getPublicResolverContract()

    const controllerAddress = await Resolver.interfaceImplementer(
      namehash('unit'),
      interfaces.permanentRegistrar,
    )

    return controllerAddress
  }

  async getRegistrarAddress() {
    const registrarAddress = await this.ENS?.owner(namehash('unit'))

    return registrarAddress
  }

  /**
   * @param {*} domain
   * @returns
   */
  async getOwner(domain: string) {
    const owner = await this.ENS?.owner(namehash(domain))
    return owner
  }

  /**
   * @param {*} domain
   * @returns
   */
  async getResolver(domain: string) {
    return this.ENS?.resolver(namehash(domain))
  }

  async getTTL(domain: string): Promise<number> {
    return this.ENS?.ttl(namehash(domain))
  }

  /**
   * @param {*} name
   * @returns
   */
  async getAddress(domain: string) {
    const resolverAddr = await this.getResolver(domain)
    return this.getEthAddressWithResolver(domain, resolverAddr)
  }

  /**
   * @param {*} domain
   * @param {*} resolverAddr
   * @returns
   */
  async getEthAddressWithResolver(domain: string, resolverAddr: string) {
    if (parseInt(resolverAddr, 16) === 0) {
      return emptyAddress
    }

    try {
      const Resolver = getResolverContract(resolverAddr, this.provider)
      const addr = await Resolver['addr(bytes32)'](namehash(domain))
      return addr
    } catch (e) {
      throw new Error(
        `Error getting addr on the resolver contract, are you sure the resolver address is a resolver contract?-${e}`,
      )

      return emptyAddress
    }
  }

  /**
   * @param {*} address
   * @returns
   */
  async getName(address: string) {
    const reverseNode = `${address.slice(2)}.addr.reverse`
    const resolverAddr = await this.getResolver(reverseNode)
    return this.getNameWithResolver(address, resolverAddr)
  }

  async getNameWithResolver(address: string, resolverAddr: string) {
    const reverseNode = `${address.slice(2)}.addr.reverse`
    const reverseNamehash = namehash(reverseNode)
    if (parseInt(resolverAddr, 16) === 0) {
      return null
    }

    try {
      const resolverContract = getResolverContract(resolverAddr, this.provider)
      const name = await resolverContract.name(reverseNamehash)
      return name
    } catch (e) {
      throw new Error(
        `Error getting name for reverse record of ${address}-${e}`,
      )
    }
  }

  async getText(name: string, key: string) {
    const resolverAddr = await this.getResolver(name)
    return this.getTextWithResolver(name, key, resolverAddr)
  }

  async getTextWithResolver(name: string, key: string, resolverAddr: string) {
    if (parseInt(resolverAddr, 16) === 0) {
      return ''
    }

    try {
      const resolverContract = getResolverContract(resolverAddr, this.provider)
      const addr = await resolverContract.text(namehash(name), key)
      return addr
    } catch (e) {
      throw new Error(
        `Error getting text record on the resolver contract, are you sure the resolver address is a resolver contract?-${e}`,
      )
      return ''
    }
  }
}
