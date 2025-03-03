import { matches, FileHelper } from '@start9labs/start-sdk'
import { configJsonDefaults } from '../utils'
const { object, string, number, boolean } = matches

const shape = object({
  bitcoind: object({
    rpcurl: string,
    work_update_seconds: number.onMismatch(
      configJsonDefaults.bitcoind.work_update_seconds,
    ),
  }),
  stratum: object({
    listen_port: number.onMismatch(configJsonDefaults.stratum.listen_port),
    max_clients_per_thread: number.onMismatch(
      configJsonDefaults.stratum.max_clients_per_thread,
    ),
    max_threads: number.onMismatch(configJsonDefaults.stratum.max_threads),
    max_clients: number.onMismatch(configJsonDefaults.stratum.max_clients),
    vardiff_min: number.onMismatch(configJsonDefaults.stratum.vardiff_min),
    vardiff_target_shares_min: number.onMismatch(
      configJsonDefaults.stratum.vardiff_target_shares_min,
    ),
    vardiff_quickdiff_count: number.onMismatch(
      configJsonDefaults.stratum.vardiff_quickdiff_count,
    ),
    vardiff_quickdiff_delta: number.onMismatch(
      configJsonDefaults.stratum.vardiff_quickdiff_delta,
    ),
    share_stale_seconds: number.onMismatch(
      configJsonDefaults.stratum.share_stale_seconds,
    ),
    fingerprint_miners: boolean.onMismatch(
      configJsonDefaults.stratum.fingerprint_miners,
    ),
  }),
  mining: object({
    pool_address: string,
    coinbase_tag_primary: string.onMismatch(
      configJsonDefaults.mining.coinbase_tag_primary,
    ),
    coinbase_tag_secondary: string.onMismatch(
      configJsonDefaults.mining.coinbase_tag_secondary,
    ),
    coinbase_unique_id: number.onMismatch(
      configJsonDefaults.mining.coinbase_unique_id,
    ),
  }),
  api: object({
    listen_port: number.onMismatch(configJsonDefaults.api.listen_port),
  }),
  logger: object({
    log_level_console: number.onMismatch(
      configJsonDefaults.api.logger.log_level_console,
    ),
    log_to_file: boolean.onMismatch(configJsonDefaults.api.logger.log_to_file),
    log_file: string.onMismatch(configJsonDefaults.api.logger.log_file),
    log_level_file: number.onMismatch(
      configJsonDefaults.api.logger.log_level_file,
    ),
  }),
  datum: object({
    pool_host: string.onMismatch(configJsonDefaults.datum.pool_host),
    pool_port: number.onMismatch(configJsonDefaults.datum.pool_port),
    pool_pubkey: string.onMismatch(configJsonDefaults.datum.pool_pubkey),
    pool_pass_workers: boolean.onMismatch(configJsonDefaults.datum.pool_pass_workers),
    pool_pass_full_users: boolean.onMismatch(configJsonDefaults.datum.pool_pass_full_users),
    always_pay_self: boolean.onMismatch(configJsonDefaults.datum.always_pay_self),
    // reward_sharing: string.onMismatch(configJsonDefaults.datum.reward_sharing),
  }),
})

export const jsonFile = FileHelper.json(
  '/media/startos/volumes/main/config.json',
  shape,
)

