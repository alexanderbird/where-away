#!/bin/bash

AUTHORIZATION="Authorization: Bearer $NETLIFY_TOKEN"
deploy_id="$(curl -H "$USER_AGENT" -H "$AUTHORIZATION" $NETLIFY_API/sites/$SITE_ID/deploys | jq -r ".[0].id")"
curl -H "$USER_AGENT" -H "$AUTHORIZATION" -X POST $NETLIFY_API/sites/$SITE_ID/deploys/$deploy_id/restore
curl -H "$USER_AGENT" -H "$AUTHORIZATION" -X POST $NETLIFY_API/deploys/$deploy_id/lock
