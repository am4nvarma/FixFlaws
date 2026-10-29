import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthStore } from "../../store/useAuthStore"; // <--- IMPORT ZUSTAND

export default function TabLayout() {
  // 1. Get the role from your global store
  const { role } = useAuthStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ff3d3d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#fffffd",
        },
      }}
    >
      {/* --- TABS VISIBLE TO EVERYONE --- */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home Screen",
          headerTitleAlign: "center",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          headerTitleAlign: "center",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-sharp" : "person-add-outline"}
              color={color}
              size={25}
            />
          ),
        }}
      />

      {/* --- CUSTOMER ONLY TABS --- */}
      <Tabs.Protected guard={role === "customer"}>
        <Tabs.Screen
          name="create-job"
          options={{
            title: "Post A Job",
            headerTitleAlign: "center",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "bug-sharp" : "bug-outline"}
                color={color}
                size={25}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="my-jobs"
          options={{
            title: "My Requests",
            headerTitleAlign: "center",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "chatbubble-sharp" : "chatbubbles-outline"}
                color={color}
                size={25}
              />
            ),
          }}
        />
      </Tabs.Protected>

      {/* --- PROVIDER ONLY TABS --- */}
      <Tabs.Protected guard={role === "provider"}>
        <Tabs.Screen
          name="my-assigned-jobs"
          options={{
            title: "My Jobs",
            headerTitleAlign: "center",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "book-outline" : "book-sharp"} // Note: you might want to swap these if the filled icon is meant for 'focused'
                color={color}
                size={25}
              />
            ),
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}