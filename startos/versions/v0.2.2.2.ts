import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { rmdir } from 'fs/promises'

export const v_0_2_2_2 = VersionInfo.of({
  version: '0.2.2:2',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      await rmdir('/data/start9')
    },
    down: IMPOSSIBLE,
  },
})
