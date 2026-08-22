import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '#pow:0.4.1:16',
  releaseNotes: {
    en_US: `Fixes found blocks being rejected by the node as high-hash. The BLAKE2b H1 commitment now includes the header-v2 bit, so the share proof of work matches what the node computes on submitblock.`,
    es_ES: `Corrige que los bloques encontrados fueran rechazados por el nodo como high-hash. El compromiso H1 de BLAKE2b ahora incluye el bit header-v2, por lo que la prueba de trabajo del share coincide con la que calcula el nodo en submitblock.`,
    de_DE: `Behebt, dass gefundene Blöcke vom Node als high-hash abgelehnt wurden. Das BLAKE2b-H1-Commitment enthält jetzt das Header-v2-Bit, sodass der Share-Proof-of-Work mit dem übereinstimmt, was der Node bei submitblock berechnet.`,
    pl_PL: `Naprawia odrzucanie znalezionych bloków przez węzeł jako high-hash. Zobowiązanie H1 BLAKE2b zawiera teraz bit header-v2, dzięki czemu proof of work sharea zgadza się z tym, co węzeł oblicza przy submitblock.`,
    fr_FR: `Corrige le rejet des blocs trouvés par le nœud avec l'erreur high-hash. L'engagement H1 de BLAKE2b inclut désormais le bit header-v2, de sorte que la preuve de travail du share correspond à celle calculée par le nœud lors du submitblock.`,
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
