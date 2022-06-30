import { Bank } from './Bank'
import * as Joi from 'joi'
import { ValidationError } from 'joi'
import { ResponseToolkit } from '@hapi/hapi'

export function index(): string {
  return 'Hello! Nice to have met you.'
}

export const routes = (bankApplication: Bank) => [
  {
    method: 'GET',
    path: '/hello',
    options: {
      handler: (request: Request, h: ResponseToolkit) => {
        return h.response(index())
      },
      description: 'Hello Bank Application',
      notes: ['A healthcheck basic endpoint'],
      plugins: {
        'hapi-swagger': {}
      },
      tags: ['api']
    }
  },
  {
    method: 'GET',
    path: '/account/{id}',
    options: {
      handler: (request: Request, h: ResponseToolkit) => {
        return h.response(getAccount(request, bankApplication))
      },
      description: 'Get Client Account',
      notes: ['Get a client account'],
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('The account id to retrieve')
        }),
        failAction: errorHandler
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      tags: ['api']
    }
  },
  {
    method: 'GET',
    path: '/account/{id}/transactions',
    options: {
      handler: (request: Request, h: ResponseToolkit) => {
        return h.response(getTransactions(request, bankApplication))
      },
      description: 'Get Client Account',
      notes: ['Get a client account'],
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('The account id on which to list transaction')
        }),
        failAction: errorHandler
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      tags: ['api']
    }
  },
  {
    method: 'PUT',
    path: '/account/{id}/deposit',
    options: {
      handler: (request: Request, h: ResponseToolkit) => {
        return h.response(makeDeposit(request, bankApplication))
      },
      description: 'Make a deposit',
      notes: ['Make a deposit'],
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('The account id on which to make a deposit')
        }),
        payload: Joi.object({
          amount: Joi.number().min(0).required().description('The amount of the deposit')
        }),
        failAction: errorHandler
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      tags: ['api']
    }
  },
  {
    method: 'PUT',
    path: '/account/{id}/checkout',
    options: {
      handler: (request: Request, h: ResponseToolkit) => {
        return h.response(makeCheckout(request, bankApplication))
      },
      description: 'Make a deposit',
      notes: ['Make a deposit'],
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('The account id on which to make a checkout')
        }),
        payload: Joi.object({
          amount: Joi.number().min(0).required().description('The amount of the checkout')
        }),
        failAction: errorHandler
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      tags: ['api']
    }
  },
  {
    method: 'POST',
    path: '/transfer',
    options: {
      handler: (request: Request, h: ResponseToolkit) => {
        return h.response(receiveATransfer(request, bankApplication))
      },
      description: 'Make a deposit',
      notes: ['Make a deposit'],
      validate: {
        payload: Joi.object({
          ibanFrom: Joi.string().required().description('The iban of the transfer destination account'),
          ibanTo: Joi.string().required().description('The iban of the transfer origin account'),
          amount: Joi.number().min(0).required().description('The amount of the transfer')
        }),
        failAction: errorHandler
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      tags: ['api']
    }
  },
  {
    method: 'GET',
    path: '/transfer/{iban}',
    options: {
      handler: (request: Request, h: ResponseToolkit) => {
        return h.response(getTransfers(request, bankApplication))
      },
      description: 'Get a list of transfers made from an Iban',
      notes: ['Get a list of transfers made from an Iban'],
      validate: {
        params: Joi.object({
          iban: Joi.string().required().description('The iban on which to list transaction')
        }),
        failAction: errorHandler
      },
      tags: ['api']
    }
  }
]

export function getAccount(request: any, bankApplication: Bank) {
  const { id } = request.params
  const account = bankApplication.getAccountByIBAN(id)

  return {
    account: account.id(),
    owner: account.owner(),
    balance: account.balance()
  }
}

export function getTransactions(request: any, bankApplication: Bank) {
  const { id } = request.params
  const account = bankApplication.getAccountByIBAN(id)

  return {
    account: account.id(),
    owner: account.owner(),
    transactionList: account.transactionList()
  }
}
export function makeDeposit(request: any, bankApplication: Bank) {
  const {
    params: { id },
    payload: { amount }
  } = request
  const account = bankApplication.getAccountByIBAN(id)

  account.deposit(amount, new Date().toISOString())

  return {
    message: `Deposit of ${amount} made successfully`
  }
}

export function makeCheckout(request: any, bankApplication: Bank) {
  const {
    params: { id },
    payload: { amount }
  } = request
  const account = bankApplication.getAccountByIBAN(id)

  account.checkout(amount, new Date().toISOString())

  return {
    message: `Checkout of ${amount} made successfully`
  }
}

export function receiveATransfer(request: any, bankApplication: Bank) {
  const {
    payload: { ibanFrom, ibanTo, amount }
  } = request
  const message = bankApplication.makeATransfer(ibanTo, ibanFrom, amount)

  return {
    message
  }
}

export function getTransfers(request: any, bankApplication: Bank) {
  const { iban } = request.params
  return bankApplication.getTransfers(iban)
}

const errorHandler = (request: any, h: any, joiError: any) => {
  const errors = [] as any
  ;(joiError as ValidationError).details.forEach((error: any) => {
    errors.push({
      field: error.path[0],
      messages: [error.message]
    })
  })
  return h.response({ errors }).code(400).takeover()
}
