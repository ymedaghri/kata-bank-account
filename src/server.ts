'use strict'

import * as Hapi from '@hapi/hapi'
import * as HapiSwagger from 'hapi-swagger'
import * as Inert from '@hapi/inert'
import * as Vision from '@hapi/vision'

import {index, getAccount, getTransactions, makeDeposit, makeCheckout, receiveATransfer} from './routes'
import { Bank } from './Bank'
import { Server } from '@hapi/hapi'
import * as Joi from "joi";

export let server: Hapi.Server

export const init = async function (bankApplication: Bank): Promise<Server> {
  server = Hapi.server({
    port: process.env.PORT || 4000,
    host: '0.0.0.0'
  })

  const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
      title: 'Test API Documentation',
      version: '0.1'
    }
  }

  const plugins: Array<Hapi.ServerRegisterPluginObject<any>> = [
    {
      plugin: Inert
    },
    {
      plugin: Vision
    },
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]

  await server.register(plugins)

  // Routes will go here
  server.route([
    {
      method: 'GET',
      path: '/hello',
      options: {
        handler: (request, h) => {
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
        handler: (request, h) => {
          return h.response(getAccount(request, bankApplication))
        },
        description: 'Get Client Account',
        notes: ['Get a client account'],
        validate: {
          params: Joi.object({
            id: Joi.string().required().description('The account id to retrieve')
          })
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
        handler: (request, h) => {
          return h.response(getTransactions(request, bankApplication))
        },
        description: 'Get Client Account',
        notes: ['Get a client account'],
        validate: {
          params: Joi.object({
            id: Joi.string().required().description('The account id on which to list transaction')
          })
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
        handler: (request, h) => {
          return h.response(makeDeposit(request, bankApplication))
        },
        description: 'Make a deposit',
        notes: ['Make a deposit'],
        validate: {
          params: Joi.object({
            id: Joi.string().required().description('The account id on which to make a deposit')
          }),
          payload: Joi.object({
            amount: Joi.number().required().description('The amount of the deposit')
          })
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
        handler: (request, h) => {
          return h.response(makeCheckout(request, bankApplication))
        },
        description: 'Make a deposit',
        notes: ['Make a deposit'],
        validate: {
          params: Joi.object({
            id: Joi.string().required().description('The account id on which to make a checkout')
          }),
          payload: Joi.object({
            amount: Joi.number().required().description('The amount of the checkout')
          })
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
        handler: (request, h) => {
          return h.response(receiveATransfer(request, bankApplication))
        },
        description: 'Make a deposit',
        notes: ['Make a deposit'],
        validate: {
          payload: Joi.object({
            ibanFrom: Joi.string().required().description('The iban of the transfer destination account'),
            ibanTo: Joi.string().required().description('The iban of the transfer origin account'),
            amount: Joi.number().min(0).required().description('The amount of the transfer')
          })
        },
        plugins: {
          'hapi-swagger': {
            payloadType: 'form'
          }
        },
        tags: ['api']
      }
    }

  ])

  return server
}

export const start = async function (): Promise<void> {
  try {
    await server.start()
    console.log('Server running at:', server.info.uri)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection')
  console.error(err)
  process.exit(1)
})
