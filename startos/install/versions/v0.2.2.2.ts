import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { rm } from 'fs/promises'

export const v_0_2_2_2 = VersionInfo.of({
  version: '0.2.2:2',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      await rm('/data/start9', { recursive: true }).catch(console.error)
    },
    down: IMPOSSIBLE,
  },
})
