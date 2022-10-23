import { ethers } from 'ethers'
import {
  convert2SupportedNetworkId,
  ENSRegistry,
  Registrar,
  Price,
  PublicResolver,
  Controller,
  ReverseRecord,
} from './models'

export class UnitDomains {
  protected provider?: ethers.providers.JsonRpcProvider

  registry?: ENSRegistry

  registrar?: Registrar

  price?: Price

  publicResolver?: PublicResolver

  controller?: Controller

  reverseRecord?: ReverseRecord

  public static async create(ethereum: any): Promise<UnitDomains> {
    const resolution = new UnitDomains()
    const provider = new ethers.providers.Web3Provider(ethereum)

    await resolution.setProvider(provider)
    return resolution
  }

  private constructor() {
    this.provider = undefined
    this.registry = undefined
    this.price = undefined
    this.publicResolver = undefined
    this.controller = undefined
    this.reverseRecord = undefined
  }

  private setProvider = async (
    provider: ethers.providers.JsonRpcProvider,
  ): Promise<void> => {
    this.provider = provider
    const network = (await this.provider.getNetwork()).chainId

    this.registry = new ENSRegistry(
      convert2SupportedNetworkId(network),
      provider,
    )

    this.publicResolver = new PublicResolver(
      await this.registry.getPublicResolverContract(),
    )

    const registrarContract = await this.registry.getRegistrarContract()
    const controllerContract = await this.registry.getControllerContract()

    this.controller = new Controller(controllerContract)

    this.registrar = new Registrar(
      this.registry,
      this.controller,
      registrarContract,
    )

    this.price = new Price(
      this.controller,
      convert2SupportedNetworkId(network),
      provider,
    )

    this.reverseRecord = new ReverseRecord(this.registry)
  }

  public async addr(domain: string): Promise<string> {
    return this.registry?.getAddress(domain)
  }

  // same as addr
  public async address(domain: string): Promise<string> {
    return this.addr(domain)
  }

  public async owner(domain: string): Promise<string> {
    return this.registry?.getOwner(domain)
  }

  public async resolver(domain: string): Promise<string> {
    return this.registry?.getResolver(domain)
  }

  public async ttl(domain: string): Promise<number> {
    return this.registry?.getTTL(domain) || 0
  }

  public async text(domain: string, key: string): Promise<string> {
    return this.registry?.getText(domain, key)
  }

  public async reverse(address: string): Promise<string> {
    return this.reverseRecord?.getReverseRecord(address) || ''
  }

  public async available(domain: string): Promise<boolean> {
    return this.controller?.available(domain)
  }

  public async rentPrice(domain: string, years: number): Promise<number> {
    return this.price?.getRentPrice(domain, years)
  }

  public async registerPrice(domain: string): Promise<number> {
    return this.price?.getRegisterPrice(domain)
  }
}
