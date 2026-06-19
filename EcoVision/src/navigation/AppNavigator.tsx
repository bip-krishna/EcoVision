import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import AssessmentScreen from "../screens/AssessmentScreen";
import ScannerScreen from "../screens/ScannerScreen";
import CoachScreen from "../screens/CoachScreen";
import SimulatorScreen from "../screens/SimulatorScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

interface TabIconProps {
  emoji: string;
  focused: boolean;
}

function TabIcon({ emoji, focused }: TabIconProps) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{emoji}</Text>
    </View>
  );
}

const tabScreens = [
  { name: "Home", component: HomeScreen, emoji: "🏠", label: "Home" },
  { name: "Assessment", component: AssessmentScreen, emoji: "📋", label: "Assess" },
  { name: "Scan", component: ScannerScreen, emoji: "📸", label: "Scan" },
  { name: "Coach", component: CoachScreen, emoji: "🧠", label: "Coach" },
  { name: "Simulator", component: SimulatorScreen, emoji: "📊", label: "Simulate" },
  { name: "Profile", component: ProfileScreen, emoji: "👤", label: "Profile" },
] as const;

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#2E7D32",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: "#2E7D32",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      {tabScreens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            tabBarLabel: screen.label,
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji={screen.emoji} focused={focused} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 22,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
  },
});
