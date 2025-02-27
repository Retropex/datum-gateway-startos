#!/bin/bash

blocknotify=$(yq e '.bitcoind.blocknotify' "/root/start9/config.yaml")

if [ "$blocknotify" = "null" ] || [ -z "$blocknotify" ]; then
    echo "Error: The blocknotify field is null or not set in Bitcoin's configuration. Your Start9 Bitcoin package may not support adding this. Knots is required." >&2
    exit 1
fi

if [ "$blocknotify" != "curl -s -m5 http://datum.embassy:7152/NOTIFY" ]; then
    echo "Error: The blocknotify field is not set correctly. Please delete it and auto-configure Knots from Datum Gateway then restart Datum Gateway." >&2
    exit 1
fi