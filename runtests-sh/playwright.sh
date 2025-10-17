#!/bin/bash
export SL_TEST_STAGE="Playwright-Test-Stage"
export MACHINE_DNS="${MACHINE_DNS1}"
export SL_LAB_ID="${SL_LABID}"
export SL_TOKEN="${SL_TOKEN}"
npx playwright test
