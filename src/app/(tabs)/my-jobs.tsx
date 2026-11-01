import { supabase } from "../../lib/supabase";
import { ActivityIndicator, FlatList, Text, View, RefreshControl, TouchableOpacity, Alert } from "react-native"; // <-- Added Alert and TouchableOpacity
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // <-- Added useMutation and useQueryClient
import { useAuthStore } from "../../store/useAuthStore";

interface Job {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
}

export default function MyJobs() {
    const { user } = useAuthStore();
    const queryClient = useQueryClient(); // <-- THIS WAS MISSING

    // 1. Fetch Customer's Jobs
    const { data: jobs, isLoading, isError, refetch, isRefetching } = useQuery({
        queryKey: ['my-jobs', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('customer_id', user.id)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data as Job[];
        },
        enabled: !!user,
    });

    // 2. Cancel Job Mutation
    const cancelJobMutation = useMutation({
        mutationFn: async (jobId: string) => {
            const { error } = await supabase
                .from('jobs')
                .update({ status: 'Cancelled' })
                .eq('id', jobId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            Alert.alert("Success", "Job cancelled successfully.");
        },
        onError: (error) => {
            Alert.alert("Error", "Failed to cancel job: " + error.message);
        }
    });

    if (isLoading) {
        return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" /></View>;
    }

    if (isError) {
        return <View style={{ flex: 1, justifyContent: 'center' }}><Text>Error loading your jobs.</Text></View>;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <FlatList
                data={jobs}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
                renderItem={({ item }) => {
                    // Check if THIS specific job is currently being cancelled
                    const isCancellingThisJob = cancelJobMutation.isPending && cancelJobMutation.variables === item.id;

                    return (
                        <View style={{ padding: 16, margin: 16, backgroundColor: '#fff', borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
                            <Text style={{ color: '#666', marginVertical: 4 }}>{item.description}</Text>
                            
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: '#006064', fontWeight: 'bold' }}>Status: {item.status}</Text>

                                {/* Cancel Button - Only show if it's still Open */}
                                {item.status === 'Open' && (
                                    <TouchableOpacity 
                                        onPress={() => cancelJobMutation.mutate(item.id)}
                                        disabled={isCancellingThisJob}
                                    >
                                        <View style={{ backgroundColor: '#ffebee', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#ffcdd2' }}>
                                            <Text style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: 12 }}>
                                                {isCancellingThisJob ? 'Cancelling...' : 'Cancel Job'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 50, color: '#888' }}>You haven't posted any jobs yet.</Text>
                }
            />
        </View>
    );
}