#!/bin/bash

AUTHORIZATION="Authorization: Bearer $NETLIFY_TOKEN"
echo Determine the id of the latest deploy
deploy_id="$(curl -H "$USER_AGENT" -H "$AUTHORIZATION" $NETLIFY_API/sites/$SITE_ID/deploys | jq -r ".[0].id")"
echo "  ▸ $deploy_id"
echo "Enable publishing deploy $deploy_id"
curl -H "$USER_AGENT" -H "$AUTHORIZATION" -X POST $NETLIFY_API/deploys/$deploy_id/unlock && echo "  ▸ success"
echo "Trigger a deploy via webhook"
curl -X POST -d {} https://api.netlify.com/build_hooks/5fb218abe07ac73e52a803a7 && echo "  ▸ success"
echo "Determine the id of the latest (webhook) deploy"
deploy_id="$(curl -H "$USER_AGENT" -H "$AUTHORIZATION" $NETLIFY_API/sites/$SITE_ID/deploys | jq -r ".[0].id")"
echo "  ▸ $deploy_id"
echo "Disable publishing any deploys beyond $deploy_id"
curl -H "$USER_AGENT" -H "$AUTHORIZATION" -X POST $NETLIFY_API/deploys/$deploy_id/lock && echo "  ▸ success"
