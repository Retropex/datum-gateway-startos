#!/bin/sh

mkdir -p /root/data

blocknotify=$(yq e '.bitcoind.blocknotify' "/root/start9/config.yaml")

if [ "$blocknotify" = "null" ] || [ -z "$blocknotify" ]; then
    echo "Error: The blocknotify field is null or not set in Bitcoin's configuration. Your Start9 Bitcoin package may not support adding this. Knots is required."
    exit 1
else
    echo "blocknotify is set to: $blocknotify"
fi

filter='.'
case $(yq eval .datum.reward_sharing /root/start9/config.yaml) in
require)
    filter="${filter}"'|.datum.pooled_mining_only=true'
    ;;
prefer)
    filter="${filter}"'|.datum.pooled_mining_only=false'
    ;;
never)
    filter="${filter}"'|.datum.pooled_mining_only=false'
    filter="${filter}"'|.datum.pool_host=""'
    ;;
esac

yq eval -o=json "
${filter}
| .username_modifiers = (
    .username_modifiers
    | map({
        key: .name,
        value: (
          .addresses 
          | map({ (.address): (.split | tonumber) }) 
          | add
        )
    }) | from_entries
)
" /root/start9/config.yaml > /root/data/datum_gateway_config.json
printf "\n\n [i] Starting Datum Gateway ...\n\n"

exec datum_gateway -c /root/data/datum_gateway_config.json
