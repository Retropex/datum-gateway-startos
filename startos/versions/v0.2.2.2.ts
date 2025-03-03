import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_0_2_2_2 = VersionInfo.of({
  version: '0.2.2:2',
  releaseNotes: 'Revamped for StartOS 0.3.6',
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
