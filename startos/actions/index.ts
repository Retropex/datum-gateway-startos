import { sdk } from '../sdk'
import { resetPassword } from './resetPassword'
import { setConfig } from './setConfig'

export const actions = sdk.Actions.of()
  .addAction(resetPassword)
  .addAction(setConfig)
