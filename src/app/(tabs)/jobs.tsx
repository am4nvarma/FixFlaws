import { supabase } from "../../lib/supabase";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { useQuery } from "@tanstack/react-query";

// Interfaces
interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

// 1. Move the fetch function OUTSIDE the component.
// It doesn't need to touch useState anymore; it just returns the data.
const fetchJobs = async (): Promise<Job[]> => {
  const { data, error } = await supabase.from("jobs").select("*");
  if (error) throw error;
  return data || [];
};

export default function Jobs() {
  // 2. Use React Query!
  // We give it a 'queryKey' (a name for the cache) and the 'queryFn' (the function to run).
  const {
    data: jobs, // The data (automatically defaults to undefined until loaded)
    isLoading, // Is it fetching for the FIRST time?
    isError, // Did it fail?
    error, // The actual error object
    refetch, // The function to manually fetch again (for the Retry button)
    isRefetching, // Is it fetching in the background (for pull-to-refresh)?
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  // 3. Early Returns
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ marginBottom: 10 }}>
          Failed to load jobs. Please check your connection.
        </Text>
        <Button title="RETRY" onPress={() => refetch()} />
      </View>
    );
  }

  // 4. Main UI
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <FlatList
        data={jobs}
        // Use isRefetching for the pull-to-refresh spinner
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const dateObj = new Date(item.created_at);
          const formattedDate = dateObj.toLocaleDateString("en-us", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <View
              style={{
                padding: 16,
                marginHorizontal: 16,
                marginTop: 12,
                backgroundColor: "#fff",
                borderRadius: 8,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    flex: 1,
                    paddingRight: 10,
                  }}
                >
                  {item.title}
                </Text>
                <Text style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                  {formattedDate}
                </Text>
              </View>
              <Text style={{ color: "#555", marginBottom: 12 }}>
                {item.description}
              </Text>
              <View
                style={{
                  backgroundColor: "#e0f7fa",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{ color: "#006064", fontWeight: "600", fontSize: 12 }}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center", marginTop: 50 }}>
            <Text style={{ fontSize: 16, color: "#888" }}>
              No Jobs Available
            </Text>
          </View>
        }
      />
    </View>
  );
}
