import { supabase } from "../../lib/supabase";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/useAuthStore";

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  customer_id: string;
  provider_id: string;
}

export default function MyAssignedJobs() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // 1. Fetch jobs assigned to THIS provider
  const {
    data: jobs,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["my-assigned-jobs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("provider_id", user.id) // <--- THE MAGIC FILTER
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Job[];
    },
    enabled: !!user,
  });

  // 2. The Mutation to update the status
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      jobId,
      newStatus,
    }: {
      jobId: string;
      newStatus: string;
    }) => {
      const { error } = await supabase
        .from("jobs")
        .update({ status: newStatus })
        .eq("id", jobId);
      if (error) throw error;
    },
    onSuccess: () => {
      // Refresh all relevant caches
      queryClient.invalidateQueries({ queryKey: ["jobs"] }); // The main feed
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] }); // The customer's view
      queryClient.invalidateQueries({ queryKey: ["my-assigned-jobs"] }); // The provider's view
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to update job status: " + error.message);
    },
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Error loading your assigned jobs.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        renderItem={({ item }) => {
          // Determine what button to show based on status
          let actionLabel = "";
          let nextStatus = "";

          if (item.status === "Accepted") {
            actionLabel = "Start Job";
            nextStatus = "In Progress";
          } else if (item.status === "In Progress") {
            actionLabel = "Mark Completed";
            nextStatus = "Completed";
          }

          const isUpdating =
            updateStatusMutation.isPending &&
            updateStatusMutation.variables?.jobId === item.id;

          return (
            <View
              style={{
                padding: 16,
                margin: 16,
                backgroundColor: "#fff",
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {item.title}
              </Text>
              <Text style={{ color: "#666", marginVertical: 4 }}>
                {item.description}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "#006064", fontWeight: "bold" }}>
                  Status: {item.status}
                </Text>

                {/* Show action button if applicable */}
                {actionLabel !== "" && (
                  <TouchableOpacity
                    onPress={() =>
                      updateStatusMutation.mutate({
                        jobId: item.id,
                        newStatus: nextStatus,
                      })
                    }
                    disabled={isUpdating}
                  >
                    <View
                      style={{
                        backgroundColor: isUpdating ? "#ccc" : "#006064",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: 12,
                        }}
                      >
                        {isUpdating ? "Updating..." : actionLabel}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 50, color: "#888" }}>
            You haven't accepted any jobs yet.
          </Text>
        }
      />
    </View>
  );
}
