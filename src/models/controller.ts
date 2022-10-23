import { Contract } from 'ethers'

import { getHostDomain, getDomain, getDomainIndex } from './domainName'

export class Controller {
  protected controllerContract: Contract

  constructor(contract: Contract) {
    this.controllerContract = contract
  }

  async available(domain: string) {
    const domainName = getHostDomain(domain)

    const label = getDomain(domainName)

    const baseNodeIndex = getDomainIndex(domainName)

    return this.controllerContract.available(label, baseNodeIndex)
  }

  async rentPrice(domain: string, duration: number) {
    const domainName = getHostDomain(domain)
    const name = getDomain(domainName)

    const baseNodeIndex = getDomainIndex(domainName)

    const price = await this.controllerContract.rentPrice(
      name,
      duration,
      baseNodeIndex,
    )
    return price
  }

  async registerPrice(domain: string, duration: number) {
    //  domainName = utils.toUtf8Bytes(domainName)
    const domainName = getHostDomain(domain)
    const name = getDomain(domainName)

    const baseNodeIndex = getDomainIndex(domainName)

    const price = await this.controllerContract.registerPrice(
      name,
      duration,
      baseNodeIndex,
    )
    return price
  }
}
