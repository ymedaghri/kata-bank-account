import { Server } from '@hapi/hapi'
import { describe, it } from 'mocha'
import { expect } from 'chai'

import { init, start } from '../src/server'
import { BankRepository } from '../src/BankRepository'
import {Bank} from "../src/Bank";

describe('Acceptance Tests : Happy Paths', async () => {
  let server: Server
  const currentDate = new Date().toISOString()

  before(async () => {
    const bankRepository = new BankRepository()
    const bank = new Bank(bankRepository)
    bank.getCurrentDate = () => currentDate
    server = await init(bank)
    await start()
  })
  after(async () => {
    await server.stop()
  })

  describe('Get an account balance and informations by its Id', () => {
    it('Should return a 403 when the id does not correspond to an existing account', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/account/id'
      })

      expect(res.statusCode).to.equal(403)
      expect(JSON.parse(res.payload)).to.deep.equal({
        statusCode: 403,
        error: 'Forbidden',
        message: 'The account with IBAN id is not an account registred in our bank'
      })
    })
    it('Should return a 200 and the current account balance', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/account/FR7630006000011234567890189'
      })

      expect(res.statusCode).to.equal(200)
      expect(JSON.parse(res.payload)).to.deep.equal({
        account: 'FR7630006000011234567890189',
        balance: 0,
        owner: 'Joe Bidjoba'
      })
    })
  })

  describe('Make a deposit on an account', () => {
    it('Should return a 403 when the id does not correspond to an existing account', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/account/id/deposit',
        payload: { amount: 225.22 }
      })

      expect(res.statusCode).to.equal(403)
      expect(JSON.parse(res.payload)).to.deep.equal({
        statusCode: 403,
        error: 'Forbidden',
        message: 'The account with IBAN id is not an account registred in our bank'
      })
    })
    it('Should return a 400 when the amount is negative', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/account/id/deposit',
        payload: { amount: -225.22 }
      })

      expect(res.statusCode).to.equal(400)
      expect(JSON.parse(res.payload)).to.deep.equal({
        errors: [
          {
            field: 'amount',
            messages: ['"amount" must be greater than or equal to 0']
          }
        ]
      })
    })
    it('Should return a 400 when the amount is missing', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/account/id/deposit',
        payload: {}
      })

      expect(res.statusCode).to.equal(400)
      expect(JSON.parse(res.payload)).to.deep.equal({
        errors: [
          {
            field: 'amount',
            messages: ['"amount" is required']
          }
        ]
      })
    })
    it('Should return a 200 and the confirmation message of the deposit', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/account/FR7630006000011234567890189/deposit',
        payload: { amount: 210.5 }
      })

      expect(res.statusCode).to.equal(200)
      expect(JSON.parse(res.payload)).to.deep.equal({
        message: 'Deposit of 210.5 made successfully'
      })
    })
  })

  describe('Make a checkout on an account', () => {
    it('Should return a 403 when the id does not correspond to an existing account', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/account/id/checkout',
        payload: { amount: 225.22 }
      })

      expect(res.statusCode).to.equal(403)
      expect(JSON.parse(res.payload)).to.deep.equal({
        statusCode: 403,
        error: 'Forbidden',
        message: 'The account with IBAN id is not an account registred in our bank'
      })
    })
    it('Should return a 400 when the amount is negative', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/account/id/checkout',
        payload: { amount: -225.22 }
      })

      expect(res.statusCode).to.equal(400)
      expect(JSON.parse(res.payload)).to.deep.equal({
        errors: [
          {
            field: 'amount',
            messages: ['"amount" must be greater than or equal to 0']
          }
        ]
      })
    })
    it('Should return a 400 when the amount is missing', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/account/id/checkout',
        payload: {}
      })

      expect(res.statusCode).to.equal(400)
      expect(JSON.parse(res.payload)).to.deep.equal({
        errors: [
          {
            field: 'amount',
            messages: ['"amount" is required']
          }
        ]
      })
    })
    it('Should return a 200 and the confirmation message of the checkout', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/account/FR7630006000011234567890189/checkout',
        payload: { amount: 210.5 }
      })

      expect(res.statusCode).to.equal(200)
      expect(JSON.parse(res.payload)).to.deep.equal({
        message: 'Checkout of 210.5 made successfully'
      })
    })
  })

  describe('Get the list of transaction on an account', () => {
    it('Should return a 403 when the id does not correspond to an existing account', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/account/id/transactions'
      })

      expect(res.statusCode).to.equal(403)
      expect(JSON.parse(res.payload)).to.deep.equal({
        statusCode: 403,
        error: 'Forbidden',
        message: 'The account with IBAN id is not an account registred in our bank'
      })
    })
    it('Should return a 200 and the list of transaction of the account', async () => {
      // GIVEN
      await server.inject({
        method: 'PUT',
        url: '/account/FO9264600123456789/deposit',
        payload: { amount: 210.5 }
      })
      await server.inject({
        method: 'PUT',
        url: '/account/FO9264600123456789/checkout',
        payload: { amount: 125.35 }
      })

      // WHEN
      const res = await server.inject({
        method: 'GET',
        url: '/account/FO9264600123456789/transactions'
      })

      // THEN
      expect(res.statusCode).to.equal(200)
      expect(JSON.parse(res.payload)).to.deep.equal({
        account: 'FO9264600123456789',
        owner: 'Sigurd Joensen',
        transactionList: [
          {
            accountNumber: 'FO9264600123456789',
            amount: 210.5,
            balance: 210.5,
            date: currentDate,
            transactionNumber: `FO9264600123456789/DEPOSIT/${currentDate}`,
            type: 'DEPOSIT'
          },
          {
            accountNumber: 'FO9264600123456789',
            amount: -125.35,
            balance: 85.15,
            date: currentDate,
            transactionNumber: `FO9264600123456789/CHECKOUT/${currentDate}`,
            type: 'CHECKOUT'
          }
        ]
      })
    })
  })

  describe('Make a transfer to an account and consult the list of transfers ', () => {
    it('Should return a 400 when the mandatory ibanFrom field is not passed to the payload', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/transfer',
        payload: {}
      })

      expect(res.statusCode).to.equal(400)
      expect(JSON.parse(res.payload)).to.deep.equal({
        errors: [
          {
            field: 'ibanFrom',
            messages: ['"ibanFrom" is required']
          }
        ]
      })
    })
    it('Should return a 200 and the list of transaction of the account', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/transfer',
        payload: {
          ibanFrom: 'FR20023941042122',
          ibanTo: 'FO9264600123456789',
          amount: 453.28
        }
      })

      expect(res.statusCode).to.equal(200)
      expect(JSON.parse(res.payload)).to.deep.equal({
        message: `The transfer has been recorder with transactionNumber FO9264600123456789/DEPOSIT/${currentDate}`
      })

      const response2 = await server.inject({
        method: 'GET',
        url: '/transfer/FR20023941042122'
      })

      expect(response2.statusCode).to.equal(200)
      expect(JSON.parse(response2.payload)).to.deep.equal({
        transfersReceived: [
          {
            amount: 453.28,
            at: currentDate,
            ibanFrom: 'FR20023941042122',
            ibanTo: 'FO9264600123456789',
            number: `FO9264600123456789/DEPOSIT/${currentDate}`
          }
        ]
      })
    })
  })
})
