# CleverPush Expo Plugin

A config plugin for [CleverPush](https://cleverpush.com) that automatically configures your Expo app for push notifications.


## Installation

```bash
npx expo install cleverpush-expo-plugin
```


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
