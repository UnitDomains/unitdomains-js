import { Contract } from 'ethers'

import { ENSRegistry } from './registry'
import { Controller } from './controller'

export class Registrar {
  protected ensRegistry: ENSRegistry

  protected controller: Controller

  protected registrar: Contract

  constructor(
    ensRegistry: ENSRegistry,
    controller: Controller,
    registrar: Contract,
  ) {
    this.ensRegistry = ensRegistry
    this.controller = controller
    this.registrar = registrar
  }
}
