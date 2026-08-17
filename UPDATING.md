# Updating the upstream version

Datum Gateway is built from source by the `Dockerfile` at the repo root. The upstream C sources are pinned via a git submodule at `datum_gateway/` tracking [`OCEAN-xyz/datum_gateway`](https://github.com/OCEAN-xyz/datum_gateway). There is no `dockerTag` to bump — the image is built locally from whatever commit the submodule points at.

## Determining the upstream version

- [`OCEAN-xyz/datum_gateway`](https://github.com/OCEAN-xyz/datum_gateway) — latest release tag:
  ```bash
  gh release view -R OCEAN-xyz/datum_gateway --json tagName -q .tagName
  ```
  The current pin lives in the submodule pointer; inspect it with:
  ```bash
  git -C datum_gateway describe --tags --always
  ```

## Applying the bump

- Update the submodule to the new upstream tag:
  ```bash
  cd datum_gateway
  git fetch --tags
  git checkout <new-tag>
  cd ..
  git add datum_gateway
  ```

</content>
</invoke>
