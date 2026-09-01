import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '#pow:0.4.1:18',
  releaseNotes: {
    en_US: `Switch to CONVOY mining gateway`,
    es_ES: `Cambio a la puerta de enlace de minería CONVOY`,
    de_DE: `Wechsel zum CONVOY-Mining-Gateway`,
    pl_PL: `Przejście na bramkę wydobywczą CONVOY`,
    fr_FR: `Passage à la passerelle de minage CONVOY`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
    other: {
        ['*']: {
            up: async ({ effects }) => {},
            down: async ({ effects }) => {},
        }
    }
  },
})
