import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock cart data
const mockCartItems = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 999,
    quantity: 1,
    image: 'https://placehold.co/400x400/png',
  },
  {
    id: '3',
    name: 'AirPods Pro',
    price: 249,
    quantity: 2,
    image: 'https://placehold.co/400x400/png',
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const updateQuantity = (id, amount) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + amount;
          if (newQuantity <= 0) {
            return null; // Will be filtered out
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const renderCartItem = ({ item }) => (
    <View
      style={[
        styles.cartItem,
        { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' },
      ]}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemPrice, { color: isDark ? '#8E8E93' : '#6E6E73' }]}>
          ${item.price}
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, -1)}>
          <Ionicons name="remove" size={20} color="#007AFF" />
        </TouchableOpacity>
        <Text style={[styles.quantity, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          {item.quantity}
        </Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, 1)}>
          <Ionicons name="add" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cartList}
          />
          <View style={[styles.summaryContainer, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Total
              </Text>
              <Text style={[styles.summaryValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                ${getTotal()}
              </Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color={isDark ? '#8E8E93' : '#C7C7CC'} />
          <Text style={[styles.emptyText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySubtext, { color: isDark ? '#8E8E93' : '#6E6E73' }]}>
            Add products to your cart to see them here
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
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
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 17,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  summaryContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 17,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    textAlign: 'center',
  },
}); 