import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '#pow:0.4.1:19',
  releaseNotes: {
    en_US: `Check if the node is BLAKE2b`,
    es_ES: `Comprobar si el nodo es BLAKE2b`,
    de_DE: `Prüfen, ob der Knoten BLAKE2b ist`,
    pl_PL: `Sprawdź, czy węzeł jest BLAKE2b`,
    fr_FR: `Vérifie si le nœud est BLAKE2b`,
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
