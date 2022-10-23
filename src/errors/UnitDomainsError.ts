export enum UnitDomainsErrorCode {
  UnregisteredDomain = 'UnregisteredDomain',
  UnsupportedDomain = 'UnsupportedDomain',
  RecordNotFound = 'RecordNotFound',
  InvalidDomainAddress = 'InvalidDomainAddress',
}

type UnitDomainsErrorOptions = {
  errorMessage?: string
  domain?: string
  method?: string
}

export class UnitDomainsError extends Error {
  readonly code: UnitDomainsErrorCode

  readonly domain?: string

  readonly method?: string

  constructor(code: UnitDomainsErrorCode, options: UnitDomainsErrorOptions = {}) {
    const { domain, method } = options

    const message = ''
    super(message)
    this.code = code
    this.domain = domain
    this.method = method
    this.name = 'ResolutionError'
    Object.setPrototypeOf(this, UnitDomainsError.prototype)
  }
}
