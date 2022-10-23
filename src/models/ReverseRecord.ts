import { ENSRegistry } from './registry'

import { emptyAddress } from './types'
import { normalize } from '../utils/normalize'

export class ReverseRecord {
  protected ENS: ENSRegistry

  constructor(ens: ENSRegistry) {
    this.ENS = ens
  }

  public async getReverseRecord(address: string): Promise<string> {
    let name = emptyAddress

    try {
      const { name: reverseName } = await this.ENS.getName(address)

      const reverseAddress = await this.ENS.getAddress(reverseName)
      const normalizedName = normalize(reverseName)
      if (
        parseInt(address, 16) === parseInt(reverseAddress, 16) &&
        reverseName === normalizedName
      ) {
        name = reverseName
      }
      if (!name) {
        return name
      }
      return ''
    } catch (e) {
      throw new Error(`Error on get reverse record of ${address}-${e}`)
    }
  }
}
