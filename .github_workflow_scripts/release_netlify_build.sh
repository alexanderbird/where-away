#!/bin/bash

AUTHORIZATION="Authorization: Bearer $NETLIFY_TOKEN"

echo Determine the id of the latest deploy
latest_deploy_id="$(curl -H "$USER_AGENT" -H "$AUTHORIZATION" $NETLIFY_API/sites/$SITE_ID/deploys | jq -r ".[0].id")"
echo "  ▸ $latest_deploy_id"

echo Determine the id of the most recently published deploy
published_deploy_id="$(curl -H "$USER_AGENT" -H "$AUTHORIZATION" $NETLIFY_API/sites/$SITE_ID/deploys | jq -r "[.[] | select(.published_at != null)][0].id")"
echo "  ▸ $published_deploy_id"

echo "Enable auto-publishing (unlock $published_deploy_id)"
curl -H "$USER_AGENT" -H "$AUTHORIZATION" -X POST $NETLIFY_API/deploys/$published_deploy_id/unlock && echo "  ▸ success"

echo "Publish deploy $latest_deploy_id"
curl -H "$USER_AGENT" -H "$AUTHORIZATION" -X POST $NETLIFY_API/sites/$SITE_ID/deploys/$latest_deploy_id/restore && echo "  ▸ success"

echo "Disable publishing any deploys beyond $latest_deploy_id"
curl -H "$USER_AGENT" -H "$AUTHORIZATION" -X POST $NETLIFY_API/deploys/$latest_deploy_id/lock && echo "  ▸ success"
