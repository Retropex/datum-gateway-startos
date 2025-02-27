import { matches, types as T } from "../deps.ts";

const { shape, boolean, string, any } = matches;

const matchOldBitcoindConfig = shape({
  rpc: shape({
    enable: boolean
  }),
  advanced: any
})

export const dependencies: T.ExpectedExports.dependencies = {
  bitcoind: {
    // deno-lint-ignore require-await
    async check(_effects, configInput) {
      if (matchOldBitcoindConfig.test(configInput) && !configInput.rpc.enable) {
        return { error: "Must have RPC enabled" };
      } else if (matchOldBitcoindConfig.test(configInput) && (!configInput.advanced.blocknotify)) {
        return { error: "Blocknotify must not be null" };
      } else if (matchOldBitcoindConfig.test(configInput)) {
        return { result: null }
      }
      return { result: null };
    },
    // deno-lint-ignore require-await
    async autoConfigure(_effects, configInput) {
      if (matchOldBitcoindConfig.test(configInput)) {
        configInput.rpc.enable = true;
        configInput.advanced.blocknotify = "curl -s -m5 http://datum.embassy:7152/NOTIFY";
        return { result: configInput }
      } else {
        return { result: configInput };
      }
    },
  },
};
