import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { signUp } = useAuth();

  const isDark = colorScheme === 'dark';

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await signUp(name, email, password);
      
      if (!success) {
        Alert.alert('Registration Failed', 'Could not create account. Email might be already in use.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during registration');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#8E8E93' : '#6E6E73' }]}>
            Sign up to get started
          </Text>

          <View style={styles.form}>
            <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}>
              <TextInput
                style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000' }]}
                placeholder="Full Name"
                placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}>
              <TextInput
                style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000' }]}
                placeholder="Email"
                placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}>
              <TextInput
                style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000' }]}
                placeholder="Password"
                placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleRegister}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: isDark ? '#8E8E93' : '#6E6E73' }]}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    marginBottom: 48,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 17,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 4,
  },
  loginText: {
    fontSize: 15,
  },
  loginLink: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
  },
}); 