import { ethers, Contract } from 'ethers'
import { SupportedNetworkId, YearInSeconds } from './types'
import { getPriceContractAddress } from '../contracts/addressConfig'
import { getLinearPremiumPriceOracle } from '../contracts'

import { Controller } from './controller'

function calculateDuration(years: number) {
  return years * YearInSeconds
}

export class Price {
  protected PriceContract: Contract

  protected provider: ethers.providers.JsonRpcProvider

  protected priceAddress: string

  protected controller: Controller

  constructor(
    controller: Controller,
    networkId: SupportedNetworkId,
    provider: ethers.providers.JsonRpcProvider,
  ) {
    this.controller = controller

    const contractAddress = getPriceContractAddress(networkId)
    if (typeof contractAddress === 'undefined')
      throw new Error(`No address for ENSRegistry on network ${networkId}`)

    this.priceAddress = contractAddress

    this.provider = provider

    this.PriceContract = getLinearPremiumPriceOracle(
      this.priceAddress,
      provider,
    )
  }

  async getPaymentType() {
    return this.PriceContract.paymentType()
  }

  async getRentPrice(domain: string, years: number) {
    const duration = calculateDuration(years)

    return this.controller.rentPrice(domain, duration)
  }

  async getRegisterPrice(domain: string) {
    const duration = calculateDuration(1)

    return this.controller.registerPrice(domain, duration)
  }

  async getRentPriceByIndex(index: number) {
    return this.PriceContract.rentPrices(index)
  }

  async getRegisterPriceByIndex(index: number) {
    return this.PriceContract.registerPrices(index)
  }

  async getAllRentPrices() {
    console.log(await this.PriceContract.rentPrices(0))
  }

  async getAllRegisterPrices() {
    console.log(await this.PriceContract.registerPrices(0))
  }
}
