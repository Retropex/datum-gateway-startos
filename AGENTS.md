# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `datum`.** Optional dependency on `bitcoind` (Bitcoin Knots — same package id as Core; the two are drop-in flavors).
- **bitcoind is reached over the LXC bridge**, not `.startos` DNS. `bitcoindRpcUrl` in `startos/utils.ts` resolves bitcoind's RPC URL via `sdk.host.getBridgeAddress` (resolves the binding’s derived bridge address on Knots' exported `rpcHostId`; both imported from `bitcoin-knots-startos/startos/utils`) and chains `.const()`, so `main.ts` restarts only when bitcoind's address changes (never on a bitcoind update) and pins the URL into the config file's `rpcurl` each run. While bitcoind is absent the helper resolves to `undefined`, `main.ts` omits `rpcurl` entirely (no dead address is written), and the binding heals it when it appears. The file model types `rpcurl` optionally (`z.string().optional()`) because the address is dynamic and absent until the dependency resolves.
- **bitcoind's `blocknotify` targets Datum's own Web UI over the bridge.** `ownUiUrl` (also `startos/utils.ts`, from `uiHostId`/`uiInterfaceId`) resolves Datum's `/NOTIFY` endpoint; `dependencies.ts` sets it on bitcoind via an autoconfig task.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach datum -n datum-sub -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `datum-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
