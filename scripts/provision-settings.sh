#!/bin/bash
source .env
ENDPOINT="https://fra.cloud.appwrite.io/v1"
PROJECT=$VITE_APPWRITE_PROJECT_ID
KEY=$VITE_APPWRITE_API_KEY
DB="schooldesk"
COL="school_settings"

echo "Creating collection $COL..."
curl -s -X POST "$ENDPOINT/databases/$DB/collections" \
  -H "X-Appwrite-Project: $PROJECT" \
  -H "X-Appwrite-Key: $KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"collectionId\": \"$COL\",
    \"name\": \"School Settings\",
    \"permissions\": [
      \"read(\\\"users\\\")\",
      \"create(\\\"users\\\")\",
      \"update(\\\"users\\\")\",
      \"delete(\\\"users\\\")\"
    ],
    \"documentSecurity\": false
  }" | jq .

sleep 2

echo "Creating attributes..."
curl -s -X POST "$ENDPOINT/databases/$DB/collections/$COL/attributes/string" \
  -H "X-Appwrite-Project: $PROJECT" -H "X-Appwrite-Key: $KEY" -H "Content-Type: application/json" \
  -d "{\"key\": \"schoolName\", \"size\": 255, \"required\": true}" | jq .

curl -s -X POST "$ENDPOINT/databases/$DB/collections/$COL/attributes/string" \
  -H "X-Appwrite-Project: $PROJECT" -H "X-Appwrite-Key: $KEY" -H "Content-Type: application/json" \
  -d "{\"key\": \"academicYear\", \"size\": 255, \"required\": false}" | jq .

curl -s -X POST "$ENDPOINT/databases/$DB/collections/$COL/attributes/string" \
  -H "X-Appwrite-Project: $PROJECT" -H "X-Appwrite-Key: $KEY" -H "Content-Type: application/json" \
  -d "{\"key\": \"gradingScale\", \"size\": 1000, \"required\": false}" | jq .

curl -s -X POST "$ENDPOINT/databases/$DB/collections/$COL/attributes/integer" \
  -H "X-Appwrite-Project: $PROJECT" -H "X-Appwrite-Key: $KEY" -H "Content-Type: application/json" \
  -d "{\"key\": \"createdAt\", \"required\": false}" | jq .

curl -s -X POST "$ENDPOINT/databases/$DB/collections/$COL/attributes/integer" \
  -H "X-Appwrite-Project: $PROJECT" -H "X-Appwrite-Key: $KEY" -H "Content-Type: application/json" \
  -d "{\"key\": \"updatedAt\", \"required\": false}" | jq .

curl -s -X POST "$ENDPOINT/databases/$DB/collections/$COL/attributes/boolean" \
  -H "X-Appwrite-Project: $PROJECT" -H "X-Appwrite-Key: $KEY" -H "Content-Type: application/json" \
  -d "{\"key\": \"synced\", \"required\": false, \"default\": false}" | jq .

curl -s -X POST "$ENDPOINT/databases/$DB/collections/$COL/attributes/boolean" \
  -H "X-Appwrite-Project: $PROJECT" -H "X-Appwrite-Key: $KEY" -H "Content-Type: application/json" \
  -d "{\"key\": \"isDeleted\", \"required\": false, \"default\": false}" | jq .

echo "Done."
