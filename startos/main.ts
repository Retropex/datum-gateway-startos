import { FileHelper } from '@start9labs/start-sdk'
import { manifest } from 'bitcoin-knots-startos/startos/manifest'
import { configJson } from './fileModels/datum_gateway_config.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  bitcoindRpcUrl,
  dataDir,
  knotsMountpoint,
  stratumPort,
  uiPort,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting Datum Gateway...')

  const conf = await configJson.read().const(effects)
  if (!conf) {
    throw new Error('datum config file not found')
  }

  // Point Datum at bitcoind's RPC over the LXC bridge (replaces bitcoind.startos DNS).
  // Absent until bitcoind resolves; omit rpcurl rather than write a dead address.
  const rpcurl = await bitcoindRpcUrl(effects)
  if (rpcurl) {
    await configJson.merge(
      effects,
      { bitcoind: { rpcurl } },
      { allowWriteAfterConst: true },
    )
  }

  const datumSub = await sdk.SubContainer.eager(
    effects,
    { imageId: 'datum' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/root',
        readonly: false,
      })
      .mountDependency<typeof manifest>({
        dependencyId: 'bitcoind',
        volumeId: 'main',
        subpath: null,
        mountpoint: knotsMountpoint,
        readonly: true,
      }),
    'datum-sub',
  )

  const rootfs = await datumSub.rootfs

  // Restart the daemon chain only when bitcoind writes a replacement cookie —
  // an absent cookie means bitcoind is down.
  await FileHelper.string(`${rootfs}${knotsMountpoint}/.cookie`)
    .read(
      (cookie) => cookie,
      (prev, next) => next === null || prev === next,
    )
    .const(effects)

  return sdk.Daemons.of(effects)
    .addDaemon('datum', {
      subcontainer: datumSub,
      exec: {
        command: [
          'datum_gateway',
          '-c',
          `/root/${dataDir}/datum_gateway_config.json`,
        ],
      },
      ready: {
        display: i18n('Web Interface'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('The Datum Gateway dashboard is ready'),
            errorMessage: i18n('The Datum Gateway dashboard is not ready'),
          }),
      },
      requires: [],
    })
    .addHealthCheck('stratum-interface', {
      ready: {
        display: i18n('Stratum Interface'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, stratumPort, {
            timeout: 1000,
            successMessage: i18n('Stratum server is available'),
            errorMessage: i18n('Stratum server is unavailable'),
          }),
      },
      requires: ['datum'],
    })
    .addHealthCheck('stratum-clients-connected', {
      ready: {
        display: i18n('Number of Stratum Clients Connected'),
        trigger: sdk.trigger.cooldownTrigger(10000),
        fn: async () => {
          try {
            const { stdout } = await datumSub.exec([
              'sh',
              '-c',
              `curl -s 127.0.0.1:7152 | grep -A1 "Total Work Subscriptions" | tail -n 1 | sed 's/[^0-9]*//g'`,
            ])
            const num = stdout.toString().trim()
            if (num) {
              return {
                result: 'success',
                message: i18n('Connected Clients: ${num}', { num }),
              }
            } else {
              throw new Error()
            }
          } catch (e) {
            return {
              result: 'success',
              message: i18n("Couldn't fetch the number of clients"),
            }
          }
        },
      },
      requires: ['datum'],
    })
    .addHealthCheck('estimated-hashrate', {
      ready: {
        display: i18n('Estimated Hashrate'),
        trigger: sdk.trigger.cooldownTrigger(10000),
        fn: async () => {
          try {
            const { stdout } = await datumSub.exec([
              'sh',
              '-c',
              `curl -s 127.0.0.1:7152 | grep -A1 "Estimated Hashrate:" | tail -n 1 | sed 's/[^0-9\.?]*//g'`,
            ])
            const num = stdout.toString().trim()
            if (num) {
              return {
                result: 'success',
                message: i18n('Estimated Hashrate: ${num} Th/s', { num }),
              }
            } else {
              throw new Error()
            }
          } catch (e) {
            return {
              result: 'success',
              message: i18n("Couldn't fetch the hashrate"),
            }
          }
        },
      },
      requires: ['datum'],
    })
})
