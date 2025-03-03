import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 999,
    image: 'https://placehold.co/400x400/png',
  },
  {
    id: '2',
    name: 'MacBook Air M2',
    price: 1199,
    image: 'https://placehold.co/400x400/png',
  },
  {
    id: '3',
    name: 'AirPods Pro',
    price: 249,
    image: 'https://placehold.co/400x400/png',
  },
  {
    id: '4',
    name: 'iPad Pro',
    price: 799,
    image: 'https://placehold.co/400x400/png',
  },
  {
    id: '5',
    name: 'Apple Watch Series 9',
    price: 399,
    image: 'https://placehold.co/400x400/png',
  },
  {
    id: '6',
    name: 'HomePod mini',
    price: 99,
    image: 'https://placehold.co/400x400/png',
  },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.productCard,
        { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' },
      ]}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          {item.name}
        </Text>
        <Text style={[styles.productPrice, { color: isDark ? '#8E8E93' : '#6E6E73' }]}>
          ${item.price}
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle" size={28} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
  },
  addButton: {
    padding: 4,
  },
}); 