import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { randomPassword } from '../utils'
import { configJson } from '../file-models/config.json'

export const resetPassword = sdk.Action.withoutInput(
  // id
  'reset-password',

  // metadata
  async ({ effects }) => {
    const hasPass = !!(await configJson.read.const(effects))?.api.admin_password
    const desc = 'your admin password'

    return {
      name: hasPass ? 'Reset Password' : 'Create Password',
      description: hasPass ? `Reset ${desc}` : `Create ${desc}`,
      warning: null,
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },

  // the execution function
  async ({ effects }) => {
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
