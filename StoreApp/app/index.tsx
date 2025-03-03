import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      
      if (userToken) {
        router.replace('/(tabs)/products');
      } else {
        router.replace('/login');
      }
    };

    checkLoginStatus();
  }, []);

  // This will show while we're checking the token
  return <Redirect href="/login" />;
} 