<p align="center">
  <img src="icon.svg" alt="Datum Gateway Logo" width="21%">
</p>

# Datum Gateway on StartOS

> Everything not listed in this document should behave the same as upstream
> DATUM Gateway. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[DATUM Gateway](https://github.com/ocean-xyz/datum-gateway) lets ASIC miners build their own block templates against a local Bitcoin node, mining solo or through a DATUM-supporting pool. This package wires it to your node, publishes the stratum endpoint for your miners, and asks the node to notify it on every new block.

- **Upstream repo:** <https://github.com/ocean-xyz/datum-gateway>
- **Wrapper repo:** <https://github.com/Start9Labs/datum-gateway-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One image, built here from upstream's source, and one subcontainer.

| Property      | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| Image         | Built from `Dockerfile` against the `datum_gateway/` source  |
| Architectures | x86_64, aarch64                                              |
| Command       | `datum_gateway -c <config>`                                  |
| Subcontainer  | `datum-sub` — the `datum` daemon, and the one to `attach` to |

## Volume and Data Layout

One volume, plus a read-only view of the Bitcoin node's.

| Volume | Mount Point | Purpose                                            |
| ------ | ----------- | -------------------------------------------------- |
| `main` | `/root`     | `data/datum_gateway_config.json`, and any log file |

Bitcoin's data directory is mounted **read-only** at `/mnt/knots`, which is how the gateway reads its RPC cookie — no credential is stored anywhere in this package.

## File Models

One model, and it is the whole of the gateway's configuration.

| File                             | Format | Modelled                | Written by                           |
| -------------------------------- | ------ | ----------------------- | ------------------------------------ |
| `data/datum_gateway_config.json` | JSON   | Yes — `FileHelper.json` | Every init, `main`, and every action |

**Enforced** — rewritten to a fixed value whenever the package writes the file: `bitcoind.rpccookiefile`, `stratum.listen_addr` and `listen_port`, `api.listen_addr` and `listen_port`, and `logger.log_to_stderr`. `bitcoind.rpcuser` and `bitcoind.rpcpassword` are modelled as "must be absent" and deleted if present — authentication is the cookie.

**Derived:** `bitcoind.rpcurl` is written by `main` from the node's own binding on every start. While Bitcoin is absent the key is omitted rather than filled with a dead address, so the connection fails honestly and heals when the node returns.

**Everything else is yours**, through the config actions. The package overrides nothing: the two values it does set — the admin password and the payout address — are requested through [tasks](#tasks) rather than defaulted, because the gateway cannot run without either and neither has a safe default.

The one place the package reshapes rather than passes through is the reward-sharing choice. Upstream expresses it as two fields — a pool host and a pooled-mining-only flag — whose combinations do not read as a spectrum; the Datum action presents a single **require / prefer / never** choice and derives both fields from it, filling in the default DATUM pool host when you ask to require sharing and no host is set. Reading the file back reverses the derivation, so the form and the file stay in agreement.

Stratum username modifiers are also reshaped: the file stores them as nested objects keyed by name and address, and the form presents them as lists, because a keyed object cannot express removal in a form.

## Dependencies

One, declared optional in the manifest but required in practice.

| Dependency | Kind      | Health check | Mount                   | Why                                          |
| ---------- | --------- | ------------ | ----------------------- | -------------------------------------------- |
| Bitcoin    | `running` | `bitcoind`   | `/mnt/knots`, read-only | Block templates over RPC, and the RPC cookie |

The node's RPC address is resolved from its own binding over the service bridge, so a Bitcoin update does not move it and nothing is configured by hand.

The daemon **restarts when Bitcoin writes a replacement RPC cookie**, but not when the cookie merely disappears — an absent cookie means Bitcoin is down, and restarting into that is pointless churn.

Datum also needs the node to push it new blocks, which the node will not do unless configured. The package therefore raises a `critical` task on **Bitcoin**, not on itself — see [Tasks](#tasks).

## Network Access and Interfaces

Two interfaces: one for you, one for your miners.

| Interface      | Id        | Type | Port  | Description                 |
| -------------- | --------- | ---- | ----- | --------------------------- |
| Web UI         | `ui`      | ui   | 7152  | The Datum Gateway dashboard |
| Stratum Server | `stratum` | api  | 23334 | Where ASICs connect         |

Both are bound on their own hosts — `main` and `mining` — so the dashboard and the miner-facing endpoint can be exposed independently. The stratum binding is plain TCP with no TLS, which is what stratum clients expect.

## Installation and First-Run Flow

Install writes the config file with its defaults and starts the daemon. Two things are then missing, and each raises a `critical` task rather than being guessed at: **the dashboard's admin password**, and **the Bitcoin address rewards are paid to**. Neither has a safe default — one is a credential, the other is where money goes.

A third piece of setup happens on Bitcoin rather than here: the node has to be told to notify the gateway on each new block, which is raised as a task on Bitcoin's own page as soon as the gateway's address is resolvable.

Once all three are done the gateway is mining — solo by default configuration, or through a pool if you change the Datum settings.

## Actions

Eight actions. Six configure the gateway, one sets the password, and one is driven by a task.

### Config — Mining, Datum, Stratum, Bitcoin RPC, API, Logger

Six actions grouped under Config, each writing its own section of the config file. All are runnable running or stopped, all are pre-filled from the current file, all are safe to re-run, and all cost seconds plus a restart.

- **Mining Settings** carries the payout address and the coinbase tags. The address is the one field that must be set for the gateway to be useful.
- **Datum** chooses between requiring collaborative reward sharing, preferring it, or never sharing — see [File Models](#file-models) for how that maps onto upstream's two fields — along with the pool's host, port, and public key. Defaults here point at OCEAN; changing them switches pool or moves to solo mining.
- **Stratum** tunes what miners see: client limits, variable difficulty, idle timeouts, and per-username payout splitting.
- **Bitcoin RPC settings** carries the template refresh interval.
- **API** carries one setting: whether to allow insecure dashboard authentication, which some browsers require and which lowers the login's security.
- **Logger** carries console and file log levels and the log file path.

### Create / Reset Password

Generates the dashboard's admin password. The action renames itself — "Create Password" when none is set, "Reset Password" afterwards — so it reads correctly both as the install task and as recovery later.

- **What it changes:** `api.admin_password` in the config file.
- **Repeat safety:** safe to re-run; each run generates a fresh password and invalidates the old one.
- **Outputs:** the password, masked and copyable. It is not recoverable afterwards.

### Config pool address — hidden

**Not in the Actions list.** It is `visibility: 'hidden'` and reachable only through the task that raises it, so a user is never sent looking for it. It sets the payout address alone; the same field is editable afterwards through Mining Settings.

## Tasks

Three tasks, and one of them appears on another service's page.

| Task                | Raised on | Severity   | Raised when                                            | Cleared when                                          |
| ------------------- | --------- | ---------- | ------------------------------------------------------ | ----------------------------------------------------- |
| Create Password     | this      | `critical` | At init, while no admin password is set                | The action runs                                       |
| Config pool address | this      | `critical` | At init, while no payout address is set                | The action runs                                       |
| Auto-Configure      | Bitcoin   | `critical` | Bitcoin's `blocknotify` is not the command Datum needs | Bitcoin's config matches; it returns if changed again |

The two local tasks are `critical` because neither a dashboard without a password nor mining without a payout address is a usable state.

The Bitcoin task is the one worth explaining, because nothing on Bitcoin's page says where it came from: Datum needs the node to call its notify endpoint whenever a block arrives, and that setting lives in Bitcoin's configuration. The task carries the exact command, including this gateway's address on the service bridge, and re-raises if the setting is ever changed away. It is only created once that address is resolvable — before then there is no correct value to ask for.

## Health Checks

Four checks. Two report health; two report numbers.

| Check                       | Displayed                             | Method                                 |
| --------------------------- | ------------------------------------- | -------------------------------------- |
| `datum`                     | "Web Interface"                       | The dashboard port is listening        |
| `stratum-interface`         | "Stratum Interface"                   | The stratum port is listening          |
| `stratum-clients-connected` | "Number of Stratum Clients Connected" | Scraped from the dashboard, every 10 s |
| `estimated-hashrate`        | "Estimated Hashrate"                  | Scraped from the dashboard, every 10 s |

**The last two never fail.** They exist to surface operating figures — how many miners are connected, and what they are producing — on the service page rather than requiring the dashboard to be open. When the value cannot be read they still report success, with a message saying so, because an unreadable statistic is not a fault.

**`stratum-interface` is the one to watch if miners cannot connect.** It is separate from the dashboard check because the two ports are independent: the dashboard can be up while the stratum listener is not.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. No dump step and nothing excluded.

- **Included:** the config file, and with it the payout address, the pool settings, and the dashboard password.
- **Restore:** complete, and no task is raised, because the password and address arrive with the backup. Bitcoin's notify setting is not part of this package's backup — if the restored server's Bitcoin node does not carry it, the task raises again there.

## Limitations and Differences

1. **A Bitcoin node is required in practice**, despite the dependency being declared optional: without it there are no block templates.
2. **Bitcoin must be configured to notify the gateway**, which is a change to Bitcoin's own settings, requested as a task on that service.
3. **Reward sharing is presented as one choice, not two fields.** The underlying pool host and pooled-mining flag are derived from it.
4. **Mining cannot start until the payout address is set**, by design rather than by defaulting to an address the package chose.
5. **The stratum endpoint is plain TCP.** There is no TLS option, which matches what ASIC firmware expects.
6. **No riscv64 build.** x86_64 and aarch64 only.

---

## Quick Reference for AI Consumers

```yaml
package_id: datum
image: ./Dockerfile # built from the datum_gateway/ source
architectures:
  - x86_64
  - aarch64
subcontainers:
  - datum-sub
volumes:
  main: /root
file_models:
  - /root/data/datum_gateway_config.json
startos_managed_env_vars: []
dependencies:
  - bitcoind # declared optional; required in practice, mounted read-only at /mnt/knots
interfaces:
  ui: { type: ui, port: 7152 }
  stratum: { type: api, port: 23334 }
actions:
  - mining-config
  - datum-config
  - stratum-config
  - bitcoind-config
  - api-config
  - logger-config
  - reset-password # renames itself to "Create Password" when none is set
  - autoconfig-pool-address # hidden; raised by task only
tasks:
  - { action: reset-password, severity: critical }
  - { action: autoconfig-pool-address, severity: critical }
  - { action: autoconfig, severity: critical } # on bitcoind, for blocknotify
health_checks:
  - datum # displayed "Web Interface"
  - stratum-interface
  - stratum-clients-connected # informational; never fails
  - estimated-hashrate # informational; never fails
```
