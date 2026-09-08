import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '#pow:0.4.1:23',
  releaseNotes: {
    en_US: "Add PR10 code for more payout outputs"
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
