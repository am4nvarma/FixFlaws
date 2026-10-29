import { View, Text, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import CustomerHome from '../../components/CustomerHome';
import ProviderHome from '../../components/ProviderHome';

export default function HomeScreen() {
    const { role } = useAuthStore();

    // If the app is still loading the role from Supabase, show a spinner
    if (!role) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#006064" />
            </View>
        );
    }

    // Conditionally render the correct dashboard
    return role === 'customer' ? <CustomerHome /> : <ProviderHome />;
}