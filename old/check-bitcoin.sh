#!/bin/bash



read DURATION
if [ "$DURATION" -le 1000 ]; then
    exit 60
else
    b_host="bitcoind.embassy"
    b_username=$(yq e '.bitcoind.rpcuser' /root/start9/config.yaml)
    b_password=$(yq e '.bitcoind.rpcpassword' /root/start9/config.yaml)

    b_gbc_result=$(curl -sS --user $b_username:$b_password --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "getblocktemplate", "params": [{"rules": ["segwit"]}]}' -H 'content-type: application/json;' http://$b_host:8332/)
    error_code=$?
    if [ $error_code -ne 0 ]; then
        echo $b_gbc_result >&2
        exit $error_code
    fi
fi
