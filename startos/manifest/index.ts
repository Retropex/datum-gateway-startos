import { setupManifest } from '@start9labs/start-sdk'
import { bitcoinDescription, long, short } from './i18n'

export const manifest = setupManifest({
  id: 'datum',
  title: 'Datum Gateway',
  license: 'mit',
  packageRepo: 'https://github.com/retropex/datum-gateway-startos',
  upstreamRepo: 'https://github.com/CONVOYMining/datum_gateway',
  marketingUrl: 'https://convoy.xyz',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    datum: {
      source: {
        dockerBuild: {
          dockerfile: 'Dockerfile',
          workdir: '.',
        },
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description: bitcoinDescription,
      optional: true,
      metadata: {
        title: 'Bitcoin',
        icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-knots-startos/cd8e4a6c77c8513cf1eca1997eb8029ed62b3863/dep-icon.svg',
      },
    },
  },
})
