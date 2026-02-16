#!/usr/bin/env sh
set -eu

docker compose -f ops/docker/compose.yaml -f ops/docker/compose.dev.yaml down
