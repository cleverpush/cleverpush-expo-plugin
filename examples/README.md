# CleverPush Expo Plugin Examples

This directory contains example projects demonstrating how to use the CleverPush Expo plugin.

## CleverPushExpoExample

A complete Expo app that demonstrates all CleverPush functionality including:

- Basic subscription management
- Custom attributes and tags
- Event tracking
- Topics management
- Real-time logging of CleverPush operations

### Quick Start

From the plugin root directory:

```bash
# Install example dependencies
npm run example:install

# Start the development server
npm run example

# Build for iOS
npm run example:prebuild
cd examples/CleverPushExpoExample && npx expo run:ios
```

### Configuration

The example app is pre-configured with:
- Development mode enabled
- iOS deployment target 12.0+
- CleverPush React Native SDK integrated

To test with your own CleverPush channel:
1. Get your Channel ID from CleverPush dashboard
2. Update the initialization in `App.tsx`
3. Configure your app bundle identifier if needed

### Features Demonstrated

- ✅ Subscribe/Unsubscribe
- ✅ Custom attribute management
- ✅ Tag management
- ✅ Event tracking
- ✅ Topics dialog
- ✅ Real-time operation logging
- ✅ iOS push notification entitlements
- ✅ Background modes configuration 