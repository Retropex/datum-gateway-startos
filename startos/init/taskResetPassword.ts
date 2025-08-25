import { resetPassword } from '../actions/resetPassword'
import { configJson } from '../fileModels/datum_gateway_config.json'
import { sdk } from '../sdk'

export const taskResetPassword = sdk.setupOnInit(async (effects) => {
  if (!(await configJson.read((c) => c.api.admin_password).const(effects))) {
    await sdk.action.createOwnTask(effects, resetPassword, 'critical', {
      reason: 'You must set an admin password to access your Datum UI',
    })
  }
})
