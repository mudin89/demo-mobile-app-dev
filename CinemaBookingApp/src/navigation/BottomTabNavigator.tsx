import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {BottomTabParamList} from './types';
import {colors} from '../theme';

import {MovieListScreen} from '../screens/Movie/MovieListScreen';
import {TicketListScreen} from '../screens/Ticket/TicketListScreen';
import {FavouriteListScreen} from '../screens/Favourite/FavouriteListScreen';
import {SettingsScreen} from '../screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route, navigation: _navigation}) => ({
        tabBarIcon: ({focused, color}) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Tickets':
              iconName = focused ? 'ticket' : 'ticket-outline';
              break;
            case 'Favourites':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return (
            <Icon
              name={iconName}
              size={24}
              color={color}
              style={{height: 24, width: 24}}
            />
          );
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBackground,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 72, // Increased from 60 to 72 for better spacing
          paddingBottom: 16, // 16dp bottom padding as requested
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarShowLabel: true,
        headerShown: false,
      })}>
      <Tab.Screen
        name="Home"
        component={MovieListScreen}
        options={() => ({
          tabBarLabel: 'Home',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.headerBackground,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.text,
          },
          headerTitle: 'Movies',
        })}
      />
      <Tab.Screen
        name="Tickets"
        component={TicketListScreen}
        options={() => ({
          tabBarLabel: 'Tickets',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.headerBackground,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.text,
          },
          headerTitle: 'My Tickets',
        })}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouriteListScreen}
        options={() => ({
          tabBarLabel: 'Favourites',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.headerBackground,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.text,
          },
          headerTitle: 'Favourites',
        })}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={() => ({
          tabBarLabel: 'Settings',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.headerBackground,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.text,
          },
          headerTitle: 'Settings',
        })}
      />
    </Tab.Navigator>
  );
};
