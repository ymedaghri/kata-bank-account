import { Server } from '@hapi/hapi'
import { describe, it } from 'mocha'
import { expect } from 'chai'

import { init, start } from '../src/server'
import { BankRepository } from '../src/BankRepository'
import {Bank} from "../src/Bank";

describe('smoke test', async () => {
  let server: Server

  before(async () => {
    const bankRepository=new BankRepository();
    server = await init(new Bank(bankRepository))
    await start()
  })
  after(async () => {
    await server.stop()
  })

  it('index responds', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/hello'
    })
    expect(res.statusCode).to.equal(200)
    expect(res.result).to.equal('Hello! Nice to have met you.')
  })
})
