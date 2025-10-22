# Sealights Playwright Integration Setup Guide

This guide explains how to properly configure and run Playwright tests with Sealights test intelligence and coverage tracking.

## Prerequisites

- Node.js and npm installed
- Sealights account and agent token
- Access to Sealights dashboard

## Environment Variables Setup

### Required Variables

You must set these environment variables before running tests:

```bash
# Your Sealights agent token (required)
export SL_TOKEN="your_sealights_token_here"

# Unique identifier for the build session (required)
export SL_BUILD_SESSION_ID="your_build_session_id_here"

# The current testing stage (required)
export SL_TEST_STAGE="e2e"
```

### Optional Variables

```bash
# Identifier for the lab environment
export SL_LAB_ID="your_lab_id_here"

# Disable Test Impact Analysis (TIA) recommendations
export SL_TIA_DISABLED="false"

# Disable the plugin entirely (keeps fixtures without errors)
export SL_DISABLE="false"

# Application URL
export MACHINE_DNS="http://internal-ian.btq.sealights.co:8081"
```

## Quick Setup

1. **Copy the example environment file:**
   ```bash
   cp sealights.env.example .env
   ```

2. **Edit the environment file with your actual values:**
   ```bash
   nano .env  # or use your preferred editor
   ```

3. **Load environment variables:**
   ```bash
   source .env
   ```

## Running Tests

### Basic Test Execution
```bash
# Run all tests with Sealights integration
npm test

# Run tests with Sealights integration (explicit)
npm run test:sealights

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui

# View test report
npm run test:report
```

### Environment Variable Validation

The configuration will log the Sealights environment variables at startup. Look for output like:
```
ℹ️ Sealights test config: {
  token: '***',
  buildSessionId: 'build_123',
  labId: 'lab_456',
  testStage: 'e2e',
  tiaDisabled: 'false',
  pluginDisabled: 'false'
}
```

## Test File Structure

All test files use the Sealights-enhanced test function:

```javascript
const { expect } = require('@playwright/test');
const { test } = require('sealights-playwright-plugin');

test('Your test description', async ({ page }) => {
  // Your test logic here
});
```

## Sealights Features

When properly configured, the plugin provides:

- **Test Intelligence**: Automatic test impact analysis
- **Coverage Tracking**: Code coverage collection during test execution
- **Test Recommendations**: Suggestions for test optimization
- **Test Skipping**: Intelligent test skipping based on code changes

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Ensure all required variables are set
   - Check the console output for missing variables

2. **Plugin Not Working**
   - Verify `SL_TOKEN` is valid
   - Check `SL_BUILD_SESSION_ID` is correct
   - Ensure `SL_DISABLE` is not set to "true"

3. **Tests Running Without Sealights**
   - Check environment variables are loaded
   - Verify the plugin is not disabled
   - Look for Sealights configuration logs

### Debug Mode

Run tests with debug output:
```bash
DEBUG=sealights* npm test
```

## Integration with CI/CD

For CI/CD pipelines, set environment variables in your build system:

```yaml
# Example for GitHub Actions
env:
  SL_TOKEN: ${{ secrets.SL_TOKEN }}
  SL_BUILD_SESSION_ID: ${{ github.run_id }}
  SL_TEST_STAGE: ci
  SL_LAB_ID: ${{ github.repository }}
```

## Support

For additional help:
- Check the [Sealights Playwright Plugin documentation](https://www.npmjs.com/package/sealights-playwright-plugin)
- Contact your Sealights administrator
- Review Sealights dashboard for test execution data
