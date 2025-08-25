import { sdk } from '../sdk'
import {
  configJson,
  ensureConfigFile,
} from '../fileModels/datum_gateway_config.json'
const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  address: Value.dynamicText(async ({ effects }) => {
    return {
      name: 'Address',
      description: 'The Bitcoin address to use for pooled/lotto mining',
      required: true,
      default: null,
      patterns: [
        {
          regex: '^[a-zA-Z0-9]+$',
          description: 'Must be alphanumeric.',
        },
      ],
    }
  }),
})

export const configPoolAddress = sdk.Action.withInput(
  // id
  'config-pool-address',

  // metadata
  async ({ effects }) => ({
    name: 'Config pool address',
    description: 'Config the pool address to mine on.',
    warning: null,
    allowedStatuses: 'any',
    group: 'Config',
    visibility: 'enabled',
  }),

  // input spec
  inputSpec,

  // optionally pre-fill form
  async ({ effects }) => {},

  // execution function
  async ({ effects, input }) => {
    const { address } = input

    const pool_address = address

    await ensureConfigFile(effects)

    await configJson.merge(effects, { mining: { pool_address } })

    return {
      version: '1',
      title: 'Sucess',
      message: `Bitcoin address set.`,
      result: null,
    }
  },
)
