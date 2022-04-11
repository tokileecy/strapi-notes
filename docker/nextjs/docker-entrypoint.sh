#!/bin/sh
set -ea

if [ -f "package.json" ]; then

  if [ -f "yarn.lock" ]; then

    yarn install

  else

    npm install

  fi

fi

echo "Starting Blog..."

exec "$@"