#!/bin/bash
# Phase 9: Branding Attributes

DB_ID="schooldesk_db"

echo "Adding branding attributes to school_settings..."

npx appwrite databases create-string-attribute \
    --database-id $DB_ID \
    --collection-id school_settings \
    --key logoUrl \
    --size 500 \
    --required false

npx appwrite databases create-string-attribute \
    --database-id $DB_ID \
    --collection-id school_settings \
    --key primaryColor \
    --size 7 \
    --required false

echo "Attributes added (processing in Appwrite background...)"
