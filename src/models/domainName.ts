const SupportDomainNamesSuffix =
  'about,area,beyond,book,cat,cell,dream,dog,east,enjoy,enter,everything,earth,focus,foot,friend,girl,go,good,boy,happy,high,hour,home,here,image,item,keep,key,local,lucky,main,meta,metaverse,moon,nature,nice,north,option,owner,person,player,point,position,power,rain,record,region,right,room,sea,side,spring,station,street,south,time,unit,verse,wind,yeah,west,well,world'

const SupportDomainNamesSuffixArray = SupportDomainNamesSuffix.split(',')

export function getSupportDomainNamesSuffixArray() {
  return SupportDomainNamesSuffixArray
}

/**
 * @param {}} suffix
 * @returns
 */
export function validateDomainSuffix(suffix: string) {
  return SupportDomainNamesSuffixArray.indexOf(suffix) >= 0
}

export function getDomainSuffix(domainName: string) {
  const lastIndex = domainName.lastIndexOf('.')

  if (lastIndex < 0) return null
  const suffix = domainName.substring(lastIndex + 1)

  if (!validateDomainSuffix(suffix)) return null
  return suffix
}

/**
 * @param {*} domainName
 * @returns
 */
export function getDomain(domainName: string) {
  const suffix = getDomainSuffix(domainName)
  let lastIndex
  if (!suffix) {
    lastIndex = domainName.lastIndexOf('.')
    if (lastIndex >= 0) return domainName.substring(lastIndex + 1)
    return domainName
  }
  lastIndex = domainName.lastIndexOf('.')
  const pre = domainName.substring(0, lastIndex)

  lastIndex = pre.lastIndexOf('.')

  if (lastIndex > 0) return pre.substring(lastIndex + 1)
  return pre
}

export function getHostDomain(domainName: string) {
  const pre = getDomain(domainName)

  const suffix = getDomainSuffix(domainName)

  if (!pre || pre.length === 0 || !suffix || suffix.length === 0) return ''

  return pre.concat('.', suffix)
}

/**
 * get index of domainName
 * @param {*} domainName
 */
export function getDomainIndex(domainName: string) {
  const suffix = getDomainSuffix(domainName)

  if (!suffix) return -1

  return SupportDomainNamesSuffixArray.indexOf(suffix)
}

export function getJointName(name: string, baseNodeIndex: number) {
  if (
    baseNodeIndex < 0 ||
    baseNodeIndex >= SupportDomainNamesSuffixArray.length
  )
    return ''

  return name.concat('.', SupportDomainNamesSuffixArray[baseNodeIndex])
}
