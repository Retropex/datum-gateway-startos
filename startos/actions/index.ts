import { sdk } from '../sdk'
import { configPoolAddress } from './configPoolAddress'
import { resetPassword } from './resetPassword'
import { setConfig } from './setConfig/setConfig'

export const actions = sdk.Actions.of()
  .addAction(resetPassword)
  .addAction(setConfig)
  .addAction(configPoolAddress)
