# CleverPush Expo Plugin

A config plugin for [CleverPush](https://cleverpush.com) that automatically configures your Expo app for push notifications.

## Features

- ✅ **Automatic iOS Configuration**: Adds required entitlements, permissions, and background modes
- ✅ **Automatic Android Configuration**: Adds required permissions and notification icons
- ✅ **Automatic NSE Installation**: Installs and configures Notification Service Extension for rich push notifications
- ✅ **Development/Production Mode Support**: Handles different APNs environments
- ✅ **Custom Notification Icons**: Support for custom Android notification icons
- ✅ **TypeScript Support**: Full TypeScript definitions included

## Installation

```bash
npx expo install cleverpush-expo-plugin
```

## Configuration

### Basic Setup

Add the plugin to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "cleverpush-expo-plugin",
        {
          "mode": "development",
          "devTeam": "KWJDGZUQ72"
        }
      ]
    ]
  }
}
```

### Automatic NSE Installation

The plugin automatically installs and configures the Notification Service Extension (NSE) for rich push notifications. This eliminates the need for manual Xcode configuration.

**Required Configuration:**
- `mode`: "development" or "production"
- `devTeam`: Your iOS development team ID (required for NSE installation)

**Optional Configuration:**
- `iPhoneDeploymentTarget`: iOS deployment target (defaults to "13.0")
- `iosNSEFilePath`: Custom NSE source file path
- `smallIcons`: Array of image paths for Android notification icons
- `smallIconAccentColor`: Accent color for Android notification icons

### Configuration Options

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `mode` | `"development" \| "production"` | ✅ | APNs environment |
| `devTeam` | `string` | ✅ | iOS development team ID |
| `iPhoneDeploymentTarget` | `string` | ❌ | iOS deployment target (default: "13.0") |
| `iosNSEFilePath` | `string` | ❌ | Custom NSE source file path |
| `smallIcons` | `string[]` | ❌ | Android notification icon paths |
| `smallIconAccentColor` | `string` | ❌ | Android notification icon accent color |

### Example Configuration

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp",
      "buildNumber": "1"
    },
    "plugins": [
      [
        "cleverpush-expo-plugin",
        {
          "mode": "development",
          "devTeam": "KWJDGZUQ72",
          "iPhoneDeploymentTarget": "13.0",
          "smallIcons": ["./assets/notification-icon.png"],
          "smallIconAccentColor": "#FF0000"
        }
      ]
    ]
  }
}
```

## What the Plugin Does

### iOS Configuration
- ✅ Adds `aps-environment` entitlement
- ✅ Adds background modes for remote notifications
- ✅ Adds app group permissions for NSE
- ✅ **Automatically installs Notification Service Extension**
- ✅ **Automatically configures Xcode project with NSE target**
- ✅ Sets up development team and code signing

### Android Configuration
- ✅ Adds required permissions
- ✅ Generates notification icons from provided images
- ✅ Configures notification channel

## Manual Steps (None Required!)

With this plugin, you don't need to:
- ❌ Manually add NSE target in Xcode
- ❌ Manually configure entitlements
- ❌ Manually add background modes
- ❌ Manually set up code signing for NSE
- ❌ Manually create notification service files

Everything is handled automatically!

## Usage in Your App

```typescript
import CleverPush from 'cleverpush-react-native';

// Initialize CleverPush
CleverPush.init('YOUR_CHANNEL_ID');

// Subscribe to push notifications
CleverPush.subscribe();

// Listen for events
CleverPush.addEventListener('subscribed', (result) => {
  console.log('Subscribed:', result.id);
});

CleverPush.addEventListener('received', (notification) => {
  console.log('Notification received:', notification);
});

CleverPush.addEventListener('opened', (result) => {
  console.log('Notification opened:', result);
});
```

## Troubleshooting

### NSE Installation Issues

If you encounter issues with NSE installation:

1. **Ensure `devTeam` is provided**: The plugin requires your iOS development team ID
2. **Check bundle identifier**: Make sure your app has a valid iOS bundle identifier
3. **Verify Xcode project**: The plugin automatically creates the NSE target in your Xcode project

### Common Errors

- `Missing required "devTeam" property`: Add your iOS development team ID to the plugin configuration
- `Missing required "mode" property`: Set mode to either "development" or "production"

## Development

### Building the Plugin

```bash
npm run build
```

### Testing

```bash
npm run test
```

## License

MIT 