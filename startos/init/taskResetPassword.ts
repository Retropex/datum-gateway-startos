import { resetPassword } from '../actions/resetPassword'
import { configJson } from '../fileModels/config.json'
import { sdk } from '../sdk'

export const taskResetPassword = sdk.setupOnInstall(async (effects) => {
  if (!(await configJson.read((c) => c.api.admin_password).const(effects))) {
    await sdk.action.requestOwn(effects, resetPassword, 'critical', {
      reason: 'You must set an admin password to access your Datum UI',
    })
  }
})
