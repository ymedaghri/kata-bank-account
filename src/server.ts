'use strict'

import * as Hapi from '@hapi/hapi'
import * as HapiSwagger from 'hapi-swagger'
import * as Inert from '@hapi/inert'
import * as Vision from '@hapi/vision'

import { Bank } from './Bank'
import { Server } from '@hapi/hapi'
import { routes } from './routes'

export let server: Hapi.Server

export const init = async function (bankApplication: Bank): Promise<Server> {
  server = Hapi.server({
    port: process.env.PORT || 4000,
    host: '0.0.0.0'
  })

  const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
      title: 'Bank Kata API Documentation',
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

  server.route(routes(bankApplication))

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
