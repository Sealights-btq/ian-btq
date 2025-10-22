#!/bin/bash

# Test script to verify Sealights Playwright integration
# This script sets up the environment and runs tests with Sealights

echo "🔧 Setting up Sealights environment for Playwright tests..."

# Check if required environment variables are set
if [ -z "$SL_TOKEN" ]; then
    echo "❌ Error: SL_TOKEN environment variable is not set"
    echo "Please set your Sealights token:"
    echo "export SL_TOKEN='your_sealights_token_here'"
    exit 1
fi

if [ -z "$SL_LAB_ID" ]; then
    echo "❌ Error: SL_LAB_ID environment variable is not set"
    echo "Please set your lab ID:"
    echo "export SL_LAB_ID='your_lab_id_here'"
    exit 1
fi

# Set required environment variables
export SL_TEST_STAGE="Playwright Tests"
export SL_TIA_DISABLED="false"
export SL_DISABLE="false"
export MACHINE_DNS="http://internal-ian.btq.sealights.co:8081"
export machine_dns="http://internal-ian.btq.sealights.co:8081"

echo "✅ Environment variables set:"
echo "  - SL_TOKEN: ***"
echo "  - SL_LAB_ID: $SL_LAB_ID"
echo "  - SL_TEST_STAGE: $SL_TEST_STAGE"
echo "  - MACHINE_DNS: $MACHINE_DNS"

echo ""
echo "🚀 Running Playwright tests with Sealights integration..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run tests
npx playwright test

echo ""
echo "✅ Test execution completed!"
echo "Check the Sealights dashboard for coverage data and test intelligence insights."
