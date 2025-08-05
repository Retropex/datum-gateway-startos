export const uiPort = 7152
export const stratumPort = 23334
export const knotsMountpoint = '/mnt/knots'
export const randomPassword = {
  charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
  len: 22,
}

// Full example: https://gist.github.com/Retropex/dfee0a1bd9c8f132dab236cda1873f14
export const configDefaults = {
  bitcoind: {
    rpccookiefile: `${knotsMountpoint}/.cookie`,
    rpcurl: 'http://bitcoind.startos:8332',
    work_update_seconds: 40,
    notify_fallback: true,
  },
  stratum: {
    listen_addr: '', // blank defaults to all
    listen_port: 23334,
    max_clients_per_thread: 128,
    max_threads: 8,
    max_clients: 1024,
    trust_proxy: -1,
    vardiff_min: 16384,
    vardiff_target_shares_min: 8,
    vardiff_quickdiff_count: 8,
    vardiff_quickdiff_delta: 8,
    share_stale_seconds: 120,
    fingerprint_miners: true,
    idle_timeout_no_subscribe: 15,
    idle_timeout_no_shares: 7200,
    idle_timeout_max_last_work: 0,
    username_modifiers: {}
  },
  mining: {
    pool_address: '',
    coinbase_tag_primary: 'DATUM Gateway',
    coinbase_tag_secondary: 'DATUM User',
    coinbase_unique_id: 4242,
    save_submitblocks_dir: '',
  },
  api: {
    admin_password: '',
    listen_port: 0, // 0 = disabled
    listen_addr: '', // blank defaults to all
    modify_conf: false,
  },
  extra_block_submissions: {
    urls: [], // include auth info eg. http://user:pass@IP
  },
  logger: {
    log_to_console: true,
    log_to_stderr: false,
    log_file: '',
    log_to_file: false,
    log_rotate_daily: true,
    log_calling_function: true,
    log_level_console: 2, // 0=All, 1=Debug, 2=Info, 3=Warn, 4=Error, 5=Fatal
    log_level_file: 1, // 0=All, 1=Debug, 2=Info, 3=Warn, 4=Error, 5=Fatal
  },
  datum: {
    pool_host: 'datum-beta1.mine.ocean.xyz', // set to "" to disable pooled mining
    pool_port: 28915,
    pool_pubkey:
      'f21f2f0ef0aa1970468f22bad9bb7f4535146f8e4a8f646bebc93da3d89b1406f40d032f09a417d94dc068055df654937922d2c89522e3e8f6f0e649de473003', // set to empty to auto-fetch
    pool_pass_workers: true,
    pool_pass_full_users: true,
    always_pay_self: true,
    pooled_mining_only: true,
    protocol_global_timeout: 60,
  },
}
