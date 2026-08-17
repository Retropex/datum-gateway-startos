# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `datum`, not `datum-gateway`.** The repo and directory are named for the product; `effects` calls, dependents, and `start-cli` all take `datum`.
- **`reward_sharing` is a derived control, not a stored field.** The action maps require/prefer/never onto upstream's `pool_host` + `pooled_mining_only`, and the pre-fill reverses it. Change one half and the form starts lying about the file's state.
- **Ports come from `bitcoin-knots-startos`, not `bitcoin-core-startos`.** Both flavors share the `bitcoind` package id, so either import resolves at runtime — but keep the import consistent with the mount point (`/mnt/knots`) so the two do not drift apart.
