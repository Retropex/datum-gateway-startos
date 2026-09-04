import { autoconfig } from 'bitcoin-knots-startos/startos/actions/config/autoconfig'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { ownUiUrl } from './utils'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  // bitcoind reaches Datum's NOTIFY endpoint over the LXC bridge (replaces the
  // deprecated datum.startos DNS name). Until the bridge URL resolves there is
  // no value that could work, so defer creating the task — the reactive read
  // re-runs this hook once the host appears and creates it with the real URL.
  const notifyBase = await ownUiUrl(effects)
  if (notifyBase) {
    const blocknotify = `curl -s -m5 ${notifyBase}/NOTIFY`

    await sdk.action.createTask(effects, 'bitcoind', autoconfig, 'critical', {
      input: {
        kind: 'partial',
        accept: [{ blocknotify }],
        set: { blocknotify },
      },
      when: { condition: 'input-not-matches', once: false },
      reason: i18n('Datum requires a particular blocknotify url'),
    })
  }

  return {
    bitcoind: {
      kind: 'running',
      versionRange: '>=#knots:29.4.1:7',
      healthChecks: ['bitcoind'],
    },
  }
})
