// imports
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, Text, View, RefreshControl } from "react-native";

// Interfaces (outside the components)
interface Job {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
}

// component starts
export default function Jobs() {
    // state
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // helper functions
    const fetchJobs = async () => {
        // 1. Clear previous errors and show the loading spinner        
        setError(null);
        setLoading(true);

        try {
            // 2. Ask Supabase for the jobs
            const { data, error } = await supabase.from('jobs').select('*');
            
            // 3. Supabase doesn't throw errors automatically. We must throw it so our catch block can handle it.
            if (error) {
                throw error;
            }
            
            // 4. If we get here it worked, Update the Jobs State.
            setJobs(data || []);

        } catch (err: any) {
            // 5. Something went wrong (no internet, database down, etc.)
            setError('Failed to load jobs. Please check your internet connection.');
        } finally {
            // 6. No matter what happens, stop the loading spinner
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchJobs();
        setRefreshing(false);
    };

    // Effects (to call the function on mount)
    useEffect(() => {
        fetchJobs();
    }, []);

    // The UI (Early Returns)
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ marginBottom: 10 }}>{error}</Text>
                <Button title="RETRY" onPress={fetchJobs} />
            </View>
        );
    }

    // Main UI (Success State)
    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <FlatList
                data={jobs}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    // Format the date before returning the UI
                    const dateObj = new Date(item.created_at);
                    const formattedDate = dateObj.toLocaleDateString('en-us', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return (
                        <View style={{
                            padding: 16,
                            marginHorizontal: 16,
                            marginTop: 12,
                            backgroundColor: '#fff',
                            borderRadius: 8,
                            shadowColor: '#000',
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2
                        }}>
                            {/* Title and Date Row */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1, paddingRight: 10 }}>
                                    {item.title}
                                </Text>
                                <Text style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                                    {formattedDate}
                                </Text>
                            </View>

                            {/* Description */}
                            <Text style={{ color: '#555', marginBottom: 12 }}>
                                {item.description}
                            </Text>

                            {/* Status Badge */}
                            <View style={{ backgroundColor: '#e0f7fa', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' }}>
                                <Text style={{ color: '#006064', fontWeight: '600', fontSize: 12 }}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                    );
                }}
                // If jobs is empty, FlatList will show this instead of a blank screen
                ListEmptyComponent={
                    <View style={{ padding: 20, alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ fontSize: 16, color: '#888' }}>No Jobs Available</Text>
                    </View>
                }
            />
        </View>
    );
}