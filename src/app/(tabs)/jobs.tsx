// imports
import { supabase } from "../../lib/supabase"
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, Text, View } from "react-native";

// Interfaces (outside the components)
interface Job {
    id:string,
    title:string,
    description:string,
    status:string,
    created_at:string;
}
// component starts
export default function Jobs() {
    // state
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const [refreshing, setRefreshing] = useState(false);
 // helper functions

    const fetchJobs = async () => {
  // 1. Clear previous errors and show the loading spinner        
        setError(null);
        setLoading(true);

         try {
// 2. Ask Supabase for the jobs
        const { data, error } = await supabase.from('jobs').select('*');
// 3. Supabase doesnt throw errors automatically. We must throw it so our 
// catch block can handle it,
            if (error) {
                throw error;
            }
// If we get here it worked, Update the Jobs State.
// TODO: setJobs(data) — but what if data is null? (Hint: data || [])
            setJobs(data  || [])

         } catch (err:any) {
    // 5. Something went wrong (no internet, database down, etc.)
    // TODO: set the error state message. 
    // Hint: err.message gives the raw database error.
        setError('Failed to load jobs. Please check your internet connection.')
         } finally {
            setLoading(false)
         }
         };
    // 6 Effects (to call the function)
    useEffect(() => {
        fetchJobs();
    }, []);
    // The UI (return statement)
    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    if (error) {
        return (
            <View>
                <Text>
                    {error}
                </Text>
                <Button title = "RETRY" onPress={fetchJobs}/>
            </View>
        );
    }

    return (
        <View style = {{ flex:1}}>
            <FlatList
            data={jobs}
            // keyExtractor is required so React knows how to track each item
            keyExtractor={(item) => (item.id)}
            renderItem={({ item }) => (
                <View>
                    <Text>{item.description}</Text>
                    <Text>{item.status}</Text>
                </View>
            )}
                // If jobs is empty, FlatList will show this instead of a blank screen
                ListEmptyComponent={
                    <View>
                        <Text> No Jobs Available</Text>
                    </View>
                }
            />
        </View>
    )
}