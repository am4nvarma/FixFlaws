import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons'

export default function TabLayout(){
    return(
        <Tabs 
        screenOptions={{
            tabBarActiveTintColor: '#ff3d3d',
            headerStyle: {
            backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle:{
        backgroundColor: '#fffffd',
        }
        }}>
            <Tabs.Screen name="home" options={{ 
                title:"Home Screen",
                headerTitleAlign:"center",
                tabBarIcon:({ color, focused}) => (
                    <Ionicons name ={focused ? 'home-sharp' : 'home-outline'}
                    color={color} size= {25}/>
                )
            }}
            />
            <Tabs.Screen name="jobs" options={{
                title:"Jobs",
                headerTitleAlign:"center",
                tabBarIcon:({ color , focused}) => (
                    <Ionicons name={ focused ? 'person-sharp' : 'person-add-outline'}
                    color={color} size={25}
                    />
                )
            }} 
                />
        </Tabs>
    )
}