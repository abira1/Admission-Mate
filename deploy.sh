#!/bin/bash

# Deploy to Firebase
echo "Deploying to Firebase..."

# Set project
export FIREBASE_TOKEN=""

# Deploy hosting
cd /app
firebase deploy --only hosting --project admission-mate --non-interactive

echo "Deployment complete!"
echo "Your app should be live at: https://admission-mate.web.app"
