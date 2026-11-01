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
        .eq("provider_id", user.id)
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
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-assigned-jobs"] });
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to update job status: " + error.message);
    },
  });

  // 3. Mutation to drop job
  const dropJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from("jobs")
        .update({ status: "Open", provider_id: null })
        .eq("id", jobId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-assigned-jobs"] });
      Alert.alert("Dropped", "You have released this job back to the pool.");
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to drop job: " + error.message);
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

          // Check if drop mutation is running for this specific job
          const isDropping =
            dropJobMutation.isPending && dropJobMutation.variables === item.id;

          return (
            <View
              style={{
                padding: 16,
                margin: 16,
                backgroundColor: "#fff",
                borderRadius: 8,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {item.title}
              </Text>
              <Text style={{ color: "#666", marginVertical: 4 }}>
                {item.description}
              </Text>

              {/* --- THIS IS THE UI SECTION THAT CHANGED --- */}
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

                {/* A row to hold both buttons side-by-side */}
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {/* DROP BUTTON (Only if Accepted) */}
                  {item.status === "Accepted" && (
                    <TouchableOpacity
                      onPress={() => dropJobMutation.mutate(item.id)}
                      disabled={isDropping}
                    >
                      <View
                        style={{
                          backgroundColor: "#ffebee",
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 6,
                          borderWidth: 1,
                          borderColor: "#ffcdd2",
                        }}
                      >
                        <Text
                          style={{
                            color: "#d32f2f",
                            fontWeight: "bold",
                            fontSize: 12,
                          }}
                        >
                          {isDropping ? "..." : "Drop"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* START / COMPLETE BUTTON */}
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
              {/* --- END OF CHANGED SECTION --- */}
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
