import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'datum',
  title: 'Datum Gateway',
  license: 'mit',
  wrapperRepo: 'https://github.com/ocean-xyz/datum-gateway-startos',
  upstreamRepo: 'https://github.com/ocean-xyz/datum-gateway',
  supportSite: 'https://ocean.xyz',
  marketingSite: 'https://ocean.xyz',
  docsUrl:
    'https://github.com/OCEAN-xyz/datum-gateway-startos/blob/next/docs/instructions.md', //@TODO update me for main branch
  donationUrl: null,
  description: {
    short: 'Make block templates and issue work to your miners',
    long: 'Datum Gateway allows miners to use their Bitcoin node to generate their own templates and issue work to their miners while still sharing rewards on a pool or solo mining..',
  },
  volumes: ['main'],
  images: {
    datum: {
      source: {
        dockerBuild: {
          dockerfile: 'Dockerfile',
          workdir: '.',
        },
      },
      arch: architectures,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch: architectures,
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description: 'Used to generate block templates',
      optional: false,
      // TODO update with knots s9pk
      s9pk: 'https://github.com/Start9Labs/bitcoind-startos/releases/download/v28.1.0.0-alpha/bitcoind.s9pk',
    },
  },
})
