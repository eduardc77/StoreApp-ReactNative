import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../lib/AuthContext';

export default function Profile() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { signOut, authState } = useAuth();
  const userInfo = authState.userInfo || {};

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: signOut,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userInfo.avatar || 'https://placehold.co/400x400/png' }}
              style={styles.profileImage}
            />
          </View>
          <Text style={[styles.name, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {userInfo.name || 'User'}
          </Text>
          <Text style={[styles.email, { color: isDark ? '#8E8E93' : '#6E6E73' }]}>
            {userInfo.email || 'user@example.com'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#8E8E93' : '#6E6E73' }]}>
            ACCOUNT
          </Text>
          
          <View style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
            <TouchableOpacity style={styles.option}>
              <Ionicons name="person-outline" size={22} color="#007AFF" />
              <Text style={[styles.optionText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Personal Information
              </Text>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#8E8E93' : '#C7C7CC'} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: isDark ? '#38383A' : '#E5E5EA' }]} />
            
            <TouchableOpacity style={styles.option}>
              <Ionicons name="card-outline" size={22} color="#007AFF" />
              <Text style={[styles.optionText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Payment Methods
              </Text>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#8E8E93' : '#C7C7CC'} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: isDark ? '#38383A' : '#E5E5EA' }]} />
            
            <TouchableOpacity style={styles.option}>
              <Ionicons name="location-outline" size={22} color="#007AFF" />
              <Text style={[styles.optionText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Shipping Addresses
              </Text>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#8E8E93' : '#C7C7CC'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#8E8E93' : '#6E6E73' }]}>
            PREFERENCES
          </Text>
          
          <View style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
            <TouchableOpacity style={styles.option}>
              <Ionicons name="notifications-outline" size={22} color="#007AFF" />
              <Text style={[styles.optionText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Notifications
              </Text>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#8E8E93' : '#C7C7CC'} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: isDark ? '#38383A' : '#E5E5EA' }]} />
            
            <TouchableOpacity style={styles.option}>
              <Ionicons name="globe-outline" size={22} color="#007AFF" />
              <Text style={[styles.optionText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Language
              </Text>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#8E8E93' : '#C7C7CC'} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}
          onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 17,
    marginLeft: 16,
  },
  divider: {
    height: 1,
    marginLeft: 56,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF3B30',
  },
}); 