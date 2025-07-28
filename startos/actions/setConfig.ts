import { sdk } from '../sdk'
import { configJson, configJsonShape } from '../fileModels/config.json'
import { inputSpec } from './config/spec'

type OutputType = {
  username_modifiers: {
    [modifierName: string]: {
      [address: string]: number
    }
  }
}

type InputType = {
  username_modifiers: {
    name: string
    addresses: { address: string; split: number }[]
  }[]
}

export const setConfig = sdk.Action.withInput(
  // id
  'set-config',

  // metadata
  async ({ effects }) => ({
    name: 'Set Config',
    description: 'Set configuration options for Datum',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const config = await configJson.read().const(effects)
    if (!config) throw new Error('Config file does not exist')
    const output: InputType = { username_modifiers: [] }
    const input: OutputType = config.stratum

    Object.entries(input.username_modifiers).forEach(
      ([modifierName, addressMap]) => {
        const addresses = Object.entries(addressMap).map(
          ([address, split]) => ({
            address,
            split,
          }),
        )

        output.username_modifiers.push({
          name: modifierName,
          addresses,
        })
      },
    )

    return { ...config, ...{ stratum: {...config.stratum, ...output }} }
  },

  // the execution function
  async ({ effects, input }) => {
    const output: any = input // typeof configJsonShape._TYPE
    const stratumOutput: OutputType = { username_modifiers: {} }

    input.stratum.username_modifiers.forEach((modifier) => {
      const addressMap: { [address: string]: number } = {}

      modifier.addresses.forEach(({ address, split }) => {
        addressMap[address] = split
      })

      stratumOutput.username_modifiers[modifier.name] = addressMap
    })

    output.stratum = { ...input.stratum, ...stratumOutput }

    configJson.merge(effects, output)
  },
)
