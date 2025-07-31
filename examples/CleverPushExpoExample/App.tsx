import React, { useEffect, useState } from 'react';
import CleverPush from 'cleverpush-react-native';
import { View, Text, Button, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';

const App = () => {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushId, setPushId] = useState<string | null>(null);
  const [isSubscribedStatus, setIsSubscribedStatus] = useState<boolean | null>(null);
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);
  const [customAttribute, setCustomAttribute] = useState('');

  useEffect(() => {
    CleverPush.enableDevelopmentMode();
    CleverPush.setShowNotificationsInForeground(true);

    CleverPush.init('RHe2nXvQk9SZgdC4x');

    const onOpened = (openResult: any) => {
      console.log('EXPO CALLBACK Notification opened:', openResult);
    };

    const onReceived = (receivedResult: any) => {
      console.log('EXPO CALLBACK Notification received:', receivedResult);
      const notificationId = receivedResult?.notification?.id;
      if (notificationId) {
        setLastNotificationId(notificationId);
        console.log('EXPO CALLBACK notification received ID:', notificationId);
      }
    };

    const onSubscribed = (res: { id: string }) => {
      setPushEnabled(true);
      setPushId(res ? res.id : null);
      console.log('EXPO CALLBACK Subscription Id:', res.id);
    };

    const onAppBannerOpened = (bannerResult: any) => {
      console.log('EXPO CALLBACK App Banner Clicked (Perform Action)');
      console.log('EXPO CALLBACK AppBannerAction type:', bannerResult.type);
      console.log('EXPO CALLBACK AppBannerAction name:', bannerResult.name);
      console.log('EXPO CALLBACK AppBannerAction URL:', bannerResult.url);
      console.log('EXPO CALLBACK AppBannerAction type:', bannerResult.urlType);
    };

    CleverPush.addEventListener('opened', onOpened);
    CleverPush.addEventListener('received', onReceived);
    CleverPush.addEventListener('subscribed', onSubscribed);
    CleverPush.addEventListener('appBannerOpened', onAppBannerOpened);

    return () => {
      CleverPush.removeEventListener('opened', onOpened);
      CleverPush.removeEventListener('received', onReceived);
      CleverPush.removeEventListener('subscribed', onSubscribed);
      CleverPush.removeEventListener('appBannerOpened', onAppBannerOpened);
    };
  }, []);

  const subscribe = () => {
    CleverPush.subscribe();
  };

  const unsubscribe = () => {
    CleverPush.unsubscribe();
    setPushEnabled(false);
    setPushId(null);
  };

  const getSubscriptionId = () => {
    CleverPush.getSubscriptionId((err, subscriptionId) => {
      console.log('EXPO CALLBACK Subscription ID:', subscriptionId);
      setPushId(subscriptionId);
    });
  };

  const handleSetCustomAttribute = () => {
    if (!customAttribute.trim()) {
      console.log('Please enter a custom attribute');
      return;
    }
    CleverPush.setSubscriptionAttribute('test_attribute', customAttribute);
    console.log('Custom attribute set:', customAttribute);
    setCustomAttribute('');
  };

  const getAvailableTag = () => {
    CleverPush.getAvailableTags((err, channelTags) => {
      console.log('Available Tags:', channelTags);
    });
  };

  const addTag = () => {
    CleverPush.addSubscriptionTag('3bfskZLimHTEhDDQ6');
  };

  const removeTag = () => {
    CleverPush.removeSubscriptionTag('3bfskZLimHTEhDDQ6');
  };

  const trackEvent = () => {
    CleverPush.trackEvent('TEST');
    CleverPush.trackEvent('Android', { property_1: 'value1', property_2: 'value2' });
  };

  const showTopicsDialog = () => {
    CleverPush.showTopicsDialog();
  };

  const getAvailableTopics = () => {
    CleverPush.getAvailableTopics((err, topics) => {
      console.log('Available Topics:', topics);
    });
  };

  const setSubscriptionTopics = () => {
    CleverPush.setSubscriptionTopics(['LpiTHuL4ABTKPJyWR', 'ptN6Bv7WN7buwoGcv']);
  };

  const addTopics = () => {
    CleverPush.addSubscriptionTopic('b6PhpE2XHLajtkYJS');
  };

  const removeTopics = () => {
    CleverPush.removeSubscriptionTopic('b6PhpE2XHLajtkYJS');
  };

  const getAvailableAttributes = () => {
    CleverPush.getAvailableAttributes((err, attributes) => {
      console.log('Available Attributes:', attributes);
    });
  };

  const getSubscriptionAttributes = () => {
    CleverPush.getSubscriptionAttributes((err, attributes) => {
      console.log('Subscription Attributes:', attributes);
    });
  };

  const setSubscriptionAttribute = () => {
    CleverPush.setSubscriptionAttribute('user_id', '1234567890');
  };

  const getSubscriptionAttribute = () => {
    CleverPush.getSubscriptionAttribute('user_id', (err, attributeValue) => {
      console.log('Subscription Attribute:', attributeValue);
    });
  };

  const getNotifications = () => {
    CleverPush.getNotifications((err, notifications) => {
      console.log('Notifications:', notifications);
    });
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: '#007AFF',
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
      width: '100%',
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 16,
    },
  });
  
  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 30, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>CleverPush Expo Example</Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        CleverPush ID: {pushId ?? 'Not available'}
      </Text>
  
      <TouchableOpacity style={styles.button} onPress={subscribe}>
        <Text style={styles.buttonText}>Subscribe</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.button} onPress={unsubscribe}>
        <Text style={styles.buttonText}>Unsubscribe</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.button} onPress={getSubscriptionId}>
        <Text style={styles.buttonText}>Get Subscription ID</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.button} onPress={getAvailableTag}>
        <Text style={styles.buttonText}>Get Available Tag</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.button} onPress={addTag}>
        <Text style={styles.buttonText}>Add Tag</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.button} onPress={removeTag}>
        <Text style={styles.buttonText}>Remove Tag</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.button} onPress={trackEvent}>
        <Text style={styles.buttonText}>Track Event</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.button} onPress={showTopicsDialog}>
        <Text style={styles.buttonText}>Show Topics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={getAvailableTopics}>
        <Text style={styles.buttonText}>Get Available Topics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={setSubscriptionTopics}>
        <Text style={styles.buttonText}>Set Subscription Topics</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.button} onPress={addTopics}>
        <Text style={styles.buttonText}>Add Topics</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.button} onPress={removeTopics}>
        <Text style={styles.buttonText}>Remove Topics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={getAvailableAttributes}>
        <Text style={styles.buttonText}>Get Available Attributes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={getSubscriptionAttributes}>
        <Text style={styles.buttonText}>Get Subscription Attributes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={setSubscriptionAttribute}>
        <Text style={styles.buttonText}>Set Subscription Attribute</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={getSubscriptionAttribute}>
        <Text style={styles.buttonText}>Get Subscription Attribute</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={getNotifications}>
        <Text style={styles.buttonText}>Get Notifications</Text>
      </TouchableOpacity>
    </ScrollView>
  );
  
};

export default App;