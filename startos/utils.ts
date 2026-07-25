import { T } from '@start9labs/start-sdk'
import {
  rpcHostId as btcRpcHostId,
  rpcPort,
} from 'bitcoin-knots-startos/startos/utils'
import { sdk } from './sdk'

export const uiPort = 7152
export const stratumPort = 23334

export const dataDir = '/data'
export const knotsMountpoint = '/mnt/knots'

// Host ids (the sdk.MultiHost.of groups) — distinct from the interface ids exported on them.
export const uiHostId = 'main'
export const stratumHostId = 'mining'
export const uiInterfaceId = 'ui'
export const stratumInterfaceId = 'stratum'

/**
 * bitcoind's RPC endpoint over the LXC bridge, as a URL. Routed through
 * `sdk.host.getBridgeAddress`, so this `.const()` restarts main only when bitcoind's RPC
 * address actually changes — install, uninstall, or port change — never on a
 * bitcoind update. `undefined` while bitcoind is absent (no address could
 * work); main omits `rpcurl` in that case and the RPC connection fails
 * naturally until the binding appears and heals it.
 */
export const bitcoindRpcUrl = async (effects: T.Effects) => {
  const bridge = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'bitcoind',
      hostId: btcRpcHostId,
      internalPort: rpcPort,
      ssl: false,
    })
    .const()
  return bridge == null ? undefined : `http://${bridge}`
}

/**
 * Datum's own Web UI over the LXC bridge, as a URL, so bitcoind's blocknotify
 * can reach it — replacing the deprecated `http://datum.startos:7152`.
 * `undefined` until the interface is available.
 */
export const ownUiUrl = (effects: T.Effects) =>
  sdk.host
    .getOwn(effects, uiHostId, (host) => {
      const iface =
        host &&
        Object.values(host.bindings)
          .flatMap((b) => Object.values(b.interfaces))
          .find((i) => i.id === uiInterfaceId)
      return (
        iface &&
        iface.addressInfo
          .filter({
            kind: 'bridge',
            predicate: (h) => !h.ssl && h.metadata.kind === 'ipv4',
          })
          .format('urlstring')[0]
      )
    })
    .const()
