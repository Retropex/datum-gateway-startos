import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '#pow:0.4.1:22',
  releaseNotes: {
    en_US: "Fix compatibility issue with maveth pool"
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
    other: {
        ['*']: {
            up: async ({ effects }) => {},
        }
    }
  },
})
