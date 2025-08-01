# CleverPush Expo Plugin - Installation Guide

This guide provides step-by-step instructions for integrating CleverPush with your Expo app using the CleverPush Expo Plugin.

## Step-by-Step Installation

### 1. Install Dependencies

```bash
npx expo install cleverpush-expo-plugin

npm install cleverpush-react-native
```

### 2. Configure app.json

Add the CleverPush plugin to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "name": "Your App",
    "slug": "your-app",
    "version": "0.0.1",
    "platforms": ["ios", "android"],
    "plugins": [
      [
        "cleverpush-expo-plugin",
        {
          "mode": "development"
        }
      ]
    ],
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

### 3. Generate Native Projects

```bash
npx expo prebuild

npx expo prebuild --platform ios

npx expo prebuild --clean
```

### 4. Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

### 5. Initialize CleverPush in Your App

Create or update your main App component:

```typescript
// App.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import CleverPush from 'cleverpush-react-native';

export default function App() {
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  useEffect(() => {
    CleverPush.init('YOUR_CHANNEL_ID');
    
    const onSubscribed = (result: { id: string }) => {
      setSubscriptionId(result.id);
      console.log('Subscribed:', result.id);
    };

    const onReceived = (notification: any) => {
      console.log('Notification received:', notification);
    };

    const onOpened = (result: any) => {
      console.log('Notification opened:', result);
    };

    CleverPush.addEventListener('subscribed', onSubscribed);
    CleverPush.addEventListener('received', onReceived);
    CleverPush.addEventListener('opened', onOpened);

    return () => {
      CleverPush.removeEventListener('subscribed', onSubscribed);
      CleverPush.removeEventListener('received', onReceived);
      CleverPush.removeEventListener('opened', onOpened);
    };
  }, []);

  const handleSubscribe = () => {
    CleverPush.subscribe();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>CleverPush Integration</Text>
      {subscriptionId && (
        <Text>Subscription ID: {subscriptionId}</Text>
      )}
      <Button title="Subscribe to Notifications" onPress={handleSubscribe} />
    </View>
  );
}
```

### 6. Test the Integration


```bash
npx expo start

npx expo run:ios

npx expo run:android
```


#### Rich Notifications Not Working (in iOS)
1. Verify NSE target exists in Xcode
2. Check CleverPush framework is linked to NSE
3. Ensure app groups are configured
4. Test with actual device (not simulator)
5. Make sure that developement team had beeb selected with capabilites in main project and notification service extension.



