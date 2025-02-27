#!/bin/bash

read DURATION
if [ "$DURATION" -le 1000 ]; then
    exit 60
else
    if curl -sS http://datum.embassy:7152 >/dev/null; then
        exit 0
    else
        echo "The dashboard is not ready" >&2
        exit 1
    fi
fi
