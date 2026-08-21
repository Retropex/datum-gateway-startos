import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '#pow:0.4.1:15',
  releaseNotes: {
    en_US: `Add support for the hard-fork PoW change.`,
    es_ES: `Añade soporte para el cambio de PoW del hard fork.`,
    de_DE: `Fügt Unterstützung für die Hard-Fork-PoW-Änderung hinzu.`,
    pl_PL: `Dodaje obsługę zmiany PoW związanej z hard forkiem.`,
    fr_FR: `Ajoute la prise en charge du changement de PoW du hard fork.`,
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
