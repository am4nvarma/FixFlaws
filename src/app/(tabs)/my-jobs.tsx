import {View, Text, FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from '@/store/useAuthStore';

interface Job {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
}

export default function MyJobs () {
    const { user } = useAuthStore();

    const { data : jobs, isLoading, isError, refetch, isRefetching } = useQuery({
        queryKey: ['my-jobs', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('customer_id' , user.id) 
            .order('created_at', {ascending:false})

        if (error) throw error;
        return data as Job[];
        },
        enabled: !!user,
    });

    if(isLoading) {
    <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" /></View>
    }

    return (
        <View style= {{ flex:1, backgroundColor:'#f5f5f5' }}>
            <FlatList 
            data = {jobs}
            keyExtractor={(item) => item.id}
            renderItem= {({ item }) => (
                <View style={{ padding: 16, margin: 16, backgroundColor: '#fff', borderRadius: 8}}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
                    <Text style={{ color: '#666', marginVertical: 4 }}>{item.description}</Text>
                    <Text style={{ color: '#006064', fontWeight: 'bold' }}>Status: {item.status}</Text>
                </View>
            )}
            ListEmptyComponent={
                <Text style={{ textAlign: 'center', marginTop: 50, color: '#888' }}>You haven't posted any jobs yet.</Text>
            } 
            />
        </View>
    );
}