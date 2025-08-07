import { configPoolAddress } from '../actions/configPoolAddress'
import { configJson } from '../fileModels/config.json'
import { sdk } from '../sdk'

export const taskConfigPoolAddress = sdk.setupOnInit(async (effects) => {
  if (!(await configJson.read((c) => c.mining.pool_address).const(effects))) {
    await sdk.action.createOwnTask(effects, configPoolAddress, 'critical', {
      reason: 'You must set a pool address',
    })
  }
})
