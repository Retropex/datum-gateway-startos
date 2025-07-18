import { compat, matches, types as T } from "../deps.ts";

function migrate_022_to_0221(config: any) {
  if (config.datum.pooled_mining_only) {
    config.datum.reward_sharing = 'require';
  } else if (config.datum.pool_host) {
    config.datum.reward_sharing = 'prefer';
  } else {
    config.datum.reward_sharing = 'never';
  }
  delete config.datum.pooled_mining_only;
  return config;
}

function migrate_0221_to_022(config: any) {
  if (config.datum.reward_sharing == 'require') {
    config.datum.pooled_mining_only = true;
  } else {
    config.datum.pooled_mining_only = false;
    if (config.datum.reward_sharing == 'prefer') {
      if (!config.datum.pool_host) {
        config.datum.pool_host = 'datum-beta1.mine.ocean.xyz';
      }
    } else {  // config.datum.reward_sharing == 'never'
      config.datum.pool_host = null;
    }
  }
  delete config.datum.reward_sharing;
  return config;
}

function migrate_022_to_031(config: any) {
  config.api.admin_password = '';
  return config;
}

function migrate_031_to_022(config: any) {
  delete config.api.admin_password;
  return config;
}

export const migration: T.ExpectedExports.migration =
  compat.migrations.fromMapping(
    {
      "0.2.1": {
        up: compat.migrations.updateConfig(
          (config) => {
            return config;
          },
          false,
          { version: "0.2.1", type: "up" }
        ),
        down: compat.migrations.updateConfig(
          (config) => {
            return config;
          },
          false,
          { version: "0.2.1", type: "down" }
        ),
      },
      "0.2.2.1": {
        up: compat.migrations.updateConfig(
          migrate_022_to_0221,
          true,
          { version: "0.2.2.1", type: "up"}
        ),
        down: compat.migrations.updateConfig(
          migrate_0221_to_022,
          true,
          { version: "0.2.2.1", type: "down"}
        )
      },
      "0.3.1": {
        up: compat.migrations.updateConfig(
          migrate_022_to_031,
          true,
          { version: "0.3.1", type: "up"}
        ),
        down: compat.migrations.updateConfig(
          migrate_031_to_022,
          true,
          { version: "0.3.1", type: "down"}
        )
      },"0.4.0": {
        up: compat.migrations.updateConfig(
          (config: any) => {
            config.stratum.username_modifiers = [];
            return config;
          },
          true,
          { version: "0.4.0", type: "up"}
        ),
        down: compat.migrations.updateConfig(
          (config: any) => {
            delete config.stratum.username_modifiers;
            return config;
          },
          true,
          { version: "0.4.0", type: "down"}
        )
      }
    },
    "0.4.0"
  );
