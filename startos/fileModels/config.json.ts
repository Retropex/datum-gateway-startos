import { matches, FileHelper } from '@start9labs/start-sdk'
import { configDefaults } from '../utils'

const { object, string, number, boolean, arrayOf, dictionary, literal } = matches

const {
  bitcoind,
  stratum,
  mining,
  api,
  extra_block_submissions,
  logger,
  datum,
} = configDefaults

export const configJsonShape = object({
  bitcoind: object({
    rpccookiefile: literal(bitcoind.rpccookiefile), // rpcuser and rpcpassword keys *should not exist* so cookie is used
    rpcurl: string.onMismatch(bitcoind.rpcurl),
    work_update_seconds: number.onMismatch(bitcoind.work_update_seconds),
    notify_fallback: boolean.onMismatch(bitcoind.notify_fallback),
  }),
  stratum: object({
    listen_addr: string.onMismatch(stratum.listen_addr),
    listen_port: number.onMismatch(stratum.listen_port),
    max_clients_per_thread: number.onMismatch(stratum.max_clients_per_thread),
    max_threads: number.onMismatch(stratum.max_threads),
    max_clients: number.onMismatch(stratum.max_clients),
    trust_proxy: number.onMismatch(stratum.trust_proxy),
    vardiff_min: number.onMismatch(stratum.vardiff_min),
    vardiff_target_shares_min: number.onMismatch(
      stratum.vardiff_target_shares_min,
    ),
    vardiff_quickdiff_count: number.onMismatch(stratum.vardiff_quickdiff_count),
    vardiff_quickdiff_delta: number.onMismatch(stratum.vardiff_quickdiff_delta),
    share_stale_seconds: number.onMismatch(stratum.share_stale_seconds),
    fingerprint_miners: boolean.onMismatch(stratum.fingerprint_miners),
    idle_timeout_no_subscribe: number.onMismatch(
      stratum.idle_timeout_no_subscribe,
    ),
    idle_timeout_no_shares: number.onMismatch(stratum.idle_timeout_no_shares),
    idle_timeout_max_last_work: number.onMismatch(
      stratum.idle_timeout_max_last_work,
    ),
    username_modifiers: dictionary([
      string,
      dictionary([string, number]),
    ]).onMismatch(stratum.username_modifiers),
  }),
  mining: object({
    pool_address: string.onMismatch(mining.pool_address),
    coinbase_tag_primary: string.onMismatch(mining.coinbase_tag_primary),
    coinbase_tag_secondary: string.onMismatch(mining.coinbase_tag_secondary),
    coinbase_unique_id: number.onMismatch(mining.coinbase_unique_id),
  }),
  api: object({
    listen_port: number.onMismatch(api.listen_port),
    listen_addr: string.onMismatch(api.listen_addr),
    admin_password: string.onMismatch(api.admin_password),
  }),
  logger: object({
    log_to_stderr: boolean.onMismatch(logger.log_to_stderr),
    log_to_file: boolean.onMismatch(logger.log_to_file),
    log_file: string.onMismatch(logger.log_file),
    log_rotate_daily: boolean.onMismatch(logger.log_rotate_daily),
    log_calling_function: boolean.onMismatch(logger.log_calling_function),
    log_level_console: number.onMismatch(logger.log_level_console),
    log_level_file: number.onMismatch(logger.log_level_file),
  }),
  datum: object({
    pool_host: string.onMismatch(datum.pool_host),
    pool_port: number.onMismatch(datum.pool_port),
    pool_pubkey: string.onMismatch(datum.pool_pubkey),
    pool_pass_workers: boolean.onMismatch(datum.pool_pass_workers),
    pool_pass_full_users: boolean.onMismatch(datum.pool_pass_full_users),
    always_pay_self: boolean.onMismatch(datum.always_pay_self),
    pooled_mining_only: boolean.onMismatch(datum.pooled_mining_only),
    protocol_global_timeout: number.onMismatch(datum.protocol_global_timeout),
  }),
})

export const configJson = FileHelper.json(
  {
    volumeId: 'main',
    subpath: '/config.json',
  },
  configJsonShape,
)

export async function ensureConfigFile(effects: any) {
  const exists = await configJson.read().const(effects)
  if (!exists) {
    await configJson.write(effects, configDefaults)
  }
}
