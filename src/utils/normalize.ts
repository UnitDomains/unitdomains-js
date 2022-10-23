import { concat, hexlify, keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import * as uts46 from 'idna-uts46-hx'
import { decodeLabelhash, isEncodedLabelhash } from './labelhash'

const zeros = new Uint8Array(32)
zeros.fill(0)

export const normalize = (name: string) => name
//name ? uts46.toUnicode(name, { useStd3ASCII: true }) : name

//!!! TODO:fix
export const namehash = (name: string): string => {
  let result: string | Uint8Array = zeros

  if (name) {
    const labels = name.split('.')

    for (let i = labels.length - 1; i >= 0; i -= 1) {
      let labelSha: string
      if (isEncodedLabelhash(labels[i])) {
        labelSha = decodeLabelhash(labels[i])
      } else {
        const normalized = normalize(labels[i])
        labelSha = keccak256(toUtf8Bytes(normalized))
      }

      result = keccak256(concat([result, labelSha]))
    }
  } else {
    result = hexlify(zeros)
  }

  return result as string
}
