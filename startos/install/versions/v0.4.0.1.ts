import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { rm } from 'fs/promises'
import { configJson } from '../../fileModels/datum_gateway_config.json'
import { configDefaults } from '../../utils'

export const v_0_4_0_1 = VersionInfo.of({
  version: '0.4.0:1-alpha.0',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      
      // update the config to work with the new version without losing user config
      const config = await configJson.read().const(effects)
      if (config !== null) {
        await configJson.write(effects, config)
      } else {
        await configJson.write(effects, configDefaults)
      }
      
      await rm('/media/startos/volumes/main/start9', { recursive: true }).catch(
        console.error,
      )
    },
    down: IMPOSSIBLE,
  },
})
