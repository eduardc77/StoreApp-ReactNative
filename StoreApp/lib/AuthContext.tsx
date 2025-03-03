import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

// Define the shape of our authentication context
type AuthContextType = {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  authState: {
    isLoading: boolean;
    isSignout: boolean;
    userToken: string | null;
    userInfo: any | null;
  };
};

// Create the authentication context
const AuthContext = createContext<AuthContextType | null>(null);

// Storage keys
const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_INFO_KEY = 'auth_user_info';

// API endpoints
const API_URL = 'https://api.escuelajs.co/api/v1';
const LOGIN_URL = `${API_URL}/auth/login`;
const PROFILE_URL = `${API_URL}/auth/profile`;
const REFRESH_TOKEN_URL = `${API_URL}/auth/refresh-token`;
const REGISTER_URL = `${API_URL}/users`;

// Provider component that wraps the app and makes auth available
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<{
    isLoading: boolean;
    isSignout: boolean;
    userToken: string | null;
    userInfo: any | null;
  }>({
    isLoading: true,
    isSignout: false,
    userToken: null,
    userInfo: null,
  });
  
  const segments = useSegments();
  const router = useRouter();

  // Check if we're authenticated on mount and when segments change
  useEffect(() => {
    const checkAuth = async () => {
      if (!authState.isLoading) {
        const inAuthGroup = segments[0] === '(tabs)';
        
        if (authState.userToken && !inAuthGroup) {
          // Redirect to the main app if we have a token but aren't in the app
          router.replace('/(tabs)/products');
        } else if (!authState.userToken && inAuthGroup) {
          // Redirect to login if we don't have a token but are in the app
          router.replace('/login');
        }
      }
    };
    
    checkAuth();
  }, [segments, authState.userToken, authState.isLoading]);

  // Load tokens and user info from storage on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const [accessToken, refreshToken, userInfoStr] = await Promise.all([
          AsyncStorage.getItem(ACCESS_TOKEN_KEY),
          AsyncStorage.getItem(REFRESH_TOKEN_KEY),
          AsyncStorage.getItem(USER_INFO_KEY),
        ]);
        
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
        
        if (accessToken && refreshToken) {
          // Validate token by fetching user profile
          try {
            const isValid = await validateToken(accessToken);
            if (isValid) {
              setAuthState({
                isLoading: false,
                isSignout: false,
                userToken: accessToken,
                userInfo,
              });
              return;
            } else {
              // Try to refresh the token
              const newTokens = await refreshTokens(refreshToken);
              if (newTokens) {
                setAuthState({
                  isLoading: false,
                  isSignout: false,
                  userToken: newTokens.access_token,
                  userInfo,
                });
                return;
              }
            }
          } catch (error) {
            console.log('Token validation error:', error);
          }
        }
        
        // If we get here, either there are no tokens or they're invalid
        setAuthState({
          isLoading: false,
          isSignout: true,
          userToken: null,
          userInfo: null,
        });
      } catch (error) {
        console.log('Error loading auth from storage:', error);
        setAuthState({
          isLoading: false,
          isSignout: true,
          userToken: null,
          userInfo: null,
        });
      }
    };
    
    loadStoredAuth();
  }, []);

  // Validate token by fetching user profile
  const validateToken = async (token: string) => {
    try {
      const response = await fetch(PROFILE_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Refresh tokens
  const refreshTokens = async (refreshToken: string) => {
    try {
      const response = await fetch(REFRESH_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (response.ok) {
        const tokens = await response.json();
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
        return tokens;
      }
      return null;
    } catch (error) {
      console.log('Error refreshing token:', error);
      return null;
    }
  };

  // Fetch user profile
  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(PROFILE_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.log('Error fetching user profile:', error);
      return null;
    }
  };

  // Auth methods
  const authContext: AuthContextType = {
    signIn: async (email, password) => {
      try {
        const response = await fetch(LOGIN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
          const tokens = await response.json();
          
          // Store tokens
          await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
          
          // Fetch user profile
          const userInfo = await fetchUserProfile(tokens.access_token);
          if (userInfo) {
            await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
            
            setAuthState({
              isLoading: false,
              isSignout: false,
              userToken: tokens.access_token,
              userInfo,
            });
            return true;
          }
        }
        return false;
      } catch (error) {
        console.log('Sign in error:', error);
        return false;
      }
    },
    
    signUp: async (name, email, password) => {
      try {
        // Register new user
        const registerResponse = await fetch(REGISTER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            avatar: 'https://api.lorem.space/image/face?w=640&h=480&r=' + Math.round(Math.random() * 1000)
          }),
        });
        
        if (registerResponse.ok) {
          // If registration successful, login
          return await authContext.signIn(email, password);
        }
        return false;
      } catch (error) {
        console.log('Sign up error:', error);
        return false;
      }
    },
    
    signOut: async () => {
      // Clear tokens and state
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_INFO_KEY);
      
      setAuthState({
        isLoading: false,
        isSignout: true,
        userToken: null,
        userInfo: null,
      });
    },
    
    authState,
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 