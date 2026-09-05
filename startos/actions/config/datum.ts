import { utils } from '@start9labs/start-sdk'
import { configJson } from '../../fileModels/datum_gateway_config.json'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  pool_host: Value.text({
    name: i18n('Pool Host'),
    required: false,
    default: null,
    placeholder: 'datum-beta1.mine.convoy.xyz',
    description: i18n(
      'Remote DATUM server host/ip to use for decentralized pooled mining',
    ),
  }),
  pool_port: Value.number({
    name: i18n('Pool Port'),
    description: i18n('Remote DATUM server port'),
    required: false,
    default: null,
    placeholder: '28915',
    min: 0,
    max: 65535,
    integer: true,
  }),
  pool_pubkey: Value.text({
    name: i18n('Pool Pubkey'),
    required: false,
    default: null,
    placeholder:
      'dbb11fa0c2b5403e4f798fa6071bb97e6079d219598366032fdf2ae01962b13c5e66e2be7d6b008f0b2603f3e6f6fc64768fa786c8129c46d3e30a5867734b62',
    description: i18n(
      'Public key of the DATUM server for initiating encrypted connection. Leave empty to auto-fetch.',
    ),
  }),
  migration_max_seconds: Value.number({
    name: 'Migration max second',
    default: null,
    placeholder: '86400',
    min: 0,
    required: false,
    integer: true,
    description: 'Maximum time to remain away from the configured DATUM server after a server-requested migration (0 disables migration)',
  }),
  pool_pass_workers: Value.toggle({
    name: i18n('Pool Pass Workers'),
    default: true,
    description: i18n(
      'Pass stratum miner usernames as sub-worker names to the pool',
    ),
  }),
  pool_pass_full_users: Value.toggle({
    name: i18n('Pool Pass Full Users'),
    default: true,
    description: i18n(
      'Pass stratum miner usernames as raw usernames to the pool (use if putting multiple payout addresses on miners behind this gateway)',
    ),
  }),
  always_pay_self: Value.toggle({
    name: i18n('Always Pay Self'),
    default: true,
    description: i18n(
      'Always include my datum.pool_username payout in my blocks if possible',
    ),
  }),
  reward_sharing: Value.select({
    name: i18n('Collaborative reward sharing (pooled mining)'),
    description: i18n(
      "You can share rewards and share in others' rewards - or only get rewarded when you find a block yourself.",
    ),
    default: 'require',
    values: {
      require: 'require',
      prefer: 'prefer',
      never: 'never',
    },
  }),
})

export const datumConfig = sdk.Action.withInput(
  'datum-config',

  async () => ({
    name: i18n('Datum'),
    description: i18n(
      'Datum-Gateway settings. These are set to mine on OCEAN by default. Modify to switch to another Datum-supporting pool, or to solo mine.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: 'Config',
    visibility: 'enabled',
  }),

  inputSpec,

  // Pre-fill: derive reward_sharing from pooled_mining_only + pool_host
  async ({ effects }) => {
    const datum = await configJson.read((c) => c?.datum).const(effects)
    if (!datum) return {}
    return {
      ...datum,
      reward_sharing:
        datum.pool_host === '' && datum.pooled_mining_only === false
          ? 'never'
          : datum.pooled_mining_only === false
            ? 'prefer'
            : 'require',
    }
  },

  // Execute: derive pooled_mining_only + pool_host from reward_sharing
  async ({ effects, input }) => {
    const sharing = input.reward_sharing

    const pool_host =
      sharing === 'never'
        ? ''
        : sharing === 'require' && !input.pool_host
          ? 'datum-beta1.mine.convoy.xyz'
          : (input.pool_host ?? undefined)

    await configJson.merge(effects, {
      datum: utils.nullToUndefined({
        ...input,
        pool_host,
        pooled_mining_only: sharing === 'require',
      }),
    })
  },
)
