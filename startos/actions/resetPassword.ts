import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { randomPassword } from '../utils'
import { configJson, ensureConfigFile } from '../fileModels/config.json'

export const resetPassword = sdk.Action.withoutInput(
  // id
  'reset-password',

  // metadata
  async ({ effects }) => {
    const hasPass = !!(await configJson
      .read((c) => c.api.admin_password)
      .const(effects))

    const desc = 'your admin password'

    return {
      name: hasPass ? 'Reset Password' : 'Create Password',
      description: hasPass ? `Reset ${desc}` : `Create ${desc}`,
      warning: null,
      allowedStatuses: 'any',
      group: 'Config',
      visibility: 'enabled',
    }
  },

  // the execution function
  async ({ effects }) => {
    
    await ensureConfigFile(effects)
    
    const admin_password = utils.getDefaultString(randomPassword)

    await configJson.merge(effects, { api: { admin_password } })

    return {
      version: '1',
      title: 'Success',
      message: 'Your new password is below',
      result: {
        type: 'single',
        value: admin_password,
        masked: true,
        copyable: true,
        qr: false,
      },
    }
  },
)
