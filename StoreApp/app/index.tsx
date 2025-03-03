import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the products tab instead of index
  return <Redirect href="/(tabs)/products" />;
} 