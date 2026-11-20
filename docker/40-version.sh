#!/bin/sh
set -eu
# Render fournit le commit à l'exécution. La CI et le poste utilisent APP_VERSION.
VERSION=${RENDER_GIT_COMMIT:-${APP_VERSION:-local}}
printf '%s\n' "$VERSION" > /usr/share/nginx/html/version.txt
