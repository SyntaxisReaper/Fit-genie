import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

// Types
interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  brand: string;
  price: number;
  timesWorn: number;
  lastWorn: string;
  tags: string[];
  favorite: boolean;
  image?: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface SensorData {
  temperature: number;
  humidity: number;
  lightLevel: number;
  itemsDetected: number;
  timestamp: string;
}

interface FitGenieState {
  user: any;
  clothingItems: ClothingItem[];
  notifications: Notification[];
  sensorData: SensorData;
  isLoading: boolean;
  socket: Socket | null;
}

type FitGenieAction =
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_CLOTHING_ITEMS'; payload: ClothingItem[] }
  | { type: 'ADD_CLOTHING_ITEM'; payload: ClothingItem }
  | { type: 'UPDATE_CLOTHING_ITEM'; payload: { id: string; updates: Partial<ClothingItem> } }
  | { type: 'DELETE_CLOTHING_ITEM'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_SENSOR_DATA'; payload: SensorData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SOCKET'; payload: Socket | null };

// Initial state
const initialState: FitGenieState = {
  user: null,
  clothingItems: [],
  notifications: [],
  sensorData: {
    temperature: 22,
    humidity: 45,
    lightLevel: 850,
    itemsDetected: 52,
    timestamp: new Date().toISOString()
  },
  isLoading: false,
  socket: null
};

// Reducer
const fitGenieReducer = (state: FitGenieState, action: FitGenieAction): FitGenieState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_CLOTHING_ITEMS':
      return { ...state, clothingItems: action.payload };
    
    case 'ADD_CLOTHING_ITEM':
      return { ...state, clothingItems: [...state.clothingItems, action.payload] };
    
    case 'UPDATE_CLOTHING_ITEM':
      return {
        ...state,
        clothingItems: state.clothingItems.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        )
      };
    
    case 'DELETE_CLOTHING_ITEM':
      return {
        ...state,
        clothingItems: state.clothingItems.filter(item => item.id !== action.payload)
      };
    
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case 'UPDATE_SENSOR_DATA':
      return { ...state, sensorData: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    
    default:
      return state;
  }
};

// Context
const FitGenieContext = createContext<{
  state: FitGenieState;
  dispatch: React.Dispatch<FitGenieAction>;
  actions: {
    loadClothingItems: () => Promise<void>;
    addClothingItem: (item: Omit<ClothingItem, 'id'>) => Promise<void>;
    updateClothingItem: (id: string, updates: Partial<ClothingItem>) => Promise<void>;
    deleteClothingItem: (id: string) => Promise<void>;
    showNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
    removeNotification: (id: string) => void;
    loadWeatherData: () => Promise<any>;
    loadAnalyticsData: () => Promise<any>;
  };
} | null>(null);

// Provider
export const FitGenieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(fitGenieReducer, initialState);

  // Initialize socket connection
  useEffect(() => {
    const socket = io('http://localhost:3001');
    dispatch({ type: 'SET_SOCKET', payload: socket });

    socket.on('connect', () => {
      console.log('🔗 Connected to Fit Genie server');
    });

    socket.on('sensor-data', (data: SensorData) => {
      dispatch({ type: 'UPDATE_SENSOR_DATA', payload: data });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Actions
  const actions = {
    loadClothingItems: async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const response = await axios.get('/api/wardrobe');
        dispatch({ type: 'SET_CLOTHING_ITEMS', payload: response.data.items || [] });
      } catch (error) {
        console.error('Failed to load clothing items:', error);
        // Load sample data if API fails
        const sampleItems = generateSampleClothingItems();
        dispatch({ type: 'SET_CLOTHING_ITEMS', payload: sampleItems });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    addClothingItem: async (item: Omit<ClothingItem, 'id'>) => {
      try {
        const response = await axios.post('/api/wardrobe', item);
        dispatch({ type: 'ADD_CLOTHING_ITEM', payload: response.data });
        actions.showNotification('Item added successfully!', 'success');
      } catch (error) {
        console.error('Failed to add clothing item:', error);
        actions.showNotification('Failed to add item', 'error');
      }
    },

    updateClothingItem: async (id: string, updates: Partial<ClothingItem>) => {
      try {
        await axios.put(`/api/wardrobe/${id}`, updates);
        dispatch({ type: 'UPDATE_CLOTHING_ITEM', payload: { id, updates } });
        actions.showNotification('Item updated successfully!', 'success');
      } catch (error) {
        console.error('Failed to update clothing item:', error);
        actions.showNotification('Failed to update item', 'error');
      }
    },

    deleteClothingItem: async (id: string) => {
      try {
        await axios.delete(`/api/wardrobe/${id}`);
        dispatch({ type: 'DELETE_CLOTHING_ITEM', payload: id });
        actions.showNotification('Item deleted successfully!', 'success');
      } catch (error) {
        console.error('Failed to delete clothing item:', error);
        actions.showNotification('Failed to delete item', 'error');
      }
    },

    showNotification: (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notification: Notification = { id, type, message, duration };
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }, duration);
    },

    removeNotification: (id: string) => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    },

    loadWeatherData: async () => {
      try {
        const response = await axios.get('/api/weather');
        return response.data;
      } catch (error) {
        console.error('Failed to load weather data:', error);
        return {
          temperature: 25,
          condition: 'Sunny',
          humidity: 60,
          uvIndex: 7
        };
      }
    },

    loadAnalyticsData: async () => {
      try {
        const response = await axios.get('/api/analytics');
        return response.data;
      } catch (error) {
        console.error('Failed to load analytics data:', error);
        return generateSampleAnalytics();
      }
    }
  };

  return (
    <FitGenieContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </FitGenieContext.Provider>
  );
};

// Hook to use the context
export const useFitGenie = () => {
  const context = useContext(FitGenieContext);
  if (!context) {
    throw new Error('useFitGenie must be used within a FitGenieProvider');
  }
  return context;
};

// Helper functions
const generateSampleClothingItems = (): ClothingItem[] => [
  {
    id: '1',
    name: 'Blue Denim Jacket',
    category: 'outerwear',
    color: 'blue',
    brand: "Levi's",
    price: 89,
    timesWorn: 12,
    lastWorn: '2024-01-10',
    tags: ['casual', 'denim'],
    favorite: false
  },
  {
    id: '2',
    name: 'Black Skinny Jeans',
    category: 'bottoms',
    color: 'black',
    brand: 'H&M',
    price: 45,
    timesWorn: 25,
    lastWorn: '2024-01-12',
    tags: ['versatile', 'favorite'],
    favorite: true
  },
  {
    id: '3',
    name: 'White Sneakers',
    category: 'footwear',
    color: 'white',
    brand: 'Nike',
    price: 120,
    timesWorn: 18,
    lastWorn: '2024-01-11',
    tags: ['sports', 'casual'],
    favorite: false
  },
  {
    id: '4',
    name: 'Red Summer Dress',
    category: 'dresses',
    color: 'red',
    brand: 'Zara',
    price: 65,
    timesWorn: 8,
    lastWorn: '2024-01-05',
    tags: ['summer', 'formal'],
    favorite: false
  },
  {
    id: '5',
    name: 'Grey Wool Sweater',
    category: 'tops',
    color: 'grey',
    brand: 'Uniqlo',
    price: 55,
    timesWorn: 15,
    lastWorn: '2024-01-08',
    tags: ['winter', 'cozy'],
    favorite: false
  }
];

const generateSampleAnalytics = () => ({
  totalItems: 127,
  itemsWorn: 89,
  ecoScore: 85,
  costPerWear: 2100,
  usageBreakdown: [45, 28, 15, 12],
  weeklyActivity: [15, 12, 18, 8, 22, 25, 20],
  carbonFootprint: -24,
  waterSaved: 1240,
  wasteReduced: 3.2,
  costSaved: 340
});

export type { ClothingItem, Notification, SensorData };