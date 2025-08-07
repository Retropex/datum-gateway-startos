import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../install/versionGraph'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { taskResetPassword } from './taskResetPassword'
import { taskConfigPoolAddress } from './taskConfigPoolAddress'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
  taskResetPassword,
  taskConfigPoolAddress,
)

export const uninit = sdk.setupUninit(versionGraph)
