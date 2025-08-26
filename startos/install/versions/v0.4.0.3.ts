import { VersionInfo } from '@start9labs/start-sdk'
import { FileHelper } from '@start9labs/start-sdk'
import { configJsonShape } from '../../fileModels/datum_gateway_config.json'
import { configJson } from '../../fileModels/datum_gateway_config.json'

export const configJsonOld = FileHelper.json(
    {
      volumeId: 'main',
      subpath: `/config.json`,
    },
    configJsonShape,
)

export const v_0_4_0_3 = VersionInfo.of({
  version: '0.4.0:1-alpha.3',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      const oldConfig = await configJsonOld.read().const(effects)
      
      if (oldConfig !== null) {
        configJson.write(effects, oldConfig)
      }
      
    },
    down: async () => {},
  }
})
