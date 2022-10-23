import { Contract } from 'ethers'

export class PublicResolver {
  protected resolverContract?: Contract

  constructor(contract: Contract) {
    this.resolverContract = contract
  }
}
