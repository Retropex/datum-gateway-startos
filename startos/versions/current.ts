import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '#pow:0.4.1:18',
  releaseNotes: {
    en_US: `Update to the latest upstream code, include a mining pool fix.`,
    es_ES: `Actualización al último código upstream, incluye una corrección para el pool de minería.`,
    de_DE: `Aktualisierung auf den neuesten Upstream-Code, einschließlich einer Korrektur für den Mining-Pool.`,
    pl_PL: `Aktualizacja do najnowszego kodu upstream, zawiera poprawkę dla puli wydobywczej.`,
    fr_FR: `Mise à jour vers le dernier code upstream, incluant une correction pour le pool de minage.`,
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
