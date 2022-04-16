#!/bin/sh
set -ea

echo "Node modules not installed. Installing..."

if [ -f "package.json" ]; then

  if [ -f "yarn.lock" ]; then

    yarn install

  else

    npm install

  fi

fi

echo "Starting App..."

exec "$@"