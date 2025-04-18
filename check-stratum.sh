#!/bin/bash

read DURATION
if [ "$DURATION" -le 1000 ]; then
    exit 60
else
    if nc -z -w2 127.0.0.1 33335 >/dev/null; then
        exit 0
    else
        echo "The stratum server does not seem to be responding to requests" >&2
        exit 1
    fi
fi
