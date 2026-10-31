import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Profile() {
    const { user, role, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        Alert.alert("Log Out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Log Out", 
                style: "destructive",
                onPress: async () => {
                    await supabase.auth.signOut();
                    // Zustand listener will automatically handle clearing the user
                    // and RootLayout will redirect to /sign-in
                }
            }
        ]);
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            {/* Header Section */}
            <View style={{ backgroundColor: '#fff', padding: 24, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0f7fa', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                    <Ionicons name="person" size={40} color="#006064" />
                </View>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333' }}>
                    {user?.email?.split('@')[0] || 'User'}
                </Text>
                <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                    {user?.email}
                </Text>

                <View style={{ backgroundColor: role === 'provider' ? '#ff3d3d' : '#006064', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 12 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12, textTransform: 'capitalize' }}>
                        {role}
                    </Text>
                </View>
            </View>

            {/* Settings List */}
            <View style={{ marginTop: 20, backgroundColor: '#fff' }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                    <Ionicons name="settings-outline" size={24} color="#333" />
                    <Text style={{ fontSize: 16, marginLeft: 12, flex: 1 }}>Account Settings</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                    <Ionicons name="help-circle-outline" size={24} color="#333" />
                    <Text style={{ fontSize: 16, marginLeft: 12, flex: 1 }}>Help & Support</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
                onPress={handleLogout}
                style={{ margin: 20, padding: 16, backgroundColor: '#ffebee', borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ffcdd2' }}
            >
                <Text style={{ color: '#d32f2f', fontSize: 16, fontWeight: 'bold' }}>Log Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}