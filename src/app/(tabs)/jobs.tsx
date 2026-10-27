import { supabase } from "../../lib/supabase";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/useAuthStore";

// Interfaces
interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  customer_id: string;
  provider_id: string | null;
  category: string;
  address: string;
}

const fetchJobs = async (): Promise<Job[]> => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export default function Jobs() {
  const { user } = useAuthStore(); // Get current user
  const queryClient = useQueryClient();

  // 1. Fetch Jobs
  const {
    data: jobs,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  // 2. Accept Job Mutation
  const acceptJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      if (!user) throw new Error("Must be logged in to accept a job");

      const { error } = await supabase
        .from("jobs")
        .update({
          status: "Accepted",
          provider_id: user.id,
        })
        .eq("id", jobId)
        .eq("status", "Open"); // Double check it's still open

      if (error) throw error;
    },
    onSuccess: () => {
      // Refresh both feeds
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      Alert.alert("Success", "You have accepted this job!");
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        "Failed to accept job. Someone else may have taken it.",
      );
    },
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
        <Text style={{ marginBottom: 10 }}>Failed to load jobs.</Text>
        <Button title="RETRY" onPress={() => refetch()} />
      </View>
    );
  }

  // 4. Main UI
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <FlatList
        data={jobs}
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

          // Check if this specific job is currently being accepted
          const isAcceptingThisJob =
            acceptJobMutation.isPending &&
            acceptJobMutation.variables === item.id;

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
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#e0f7fa",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#006064",
                      fontWeight: "600",
                      fontSize: 12,
                    }}
                  >
                    {item.status}
                  </Text>
                </View>

                {/* ACCEPT JOB BUTTON */}
                {item.status === "Open" && (
                  <TouchableOpacity
                    onPress={() => acceptJobMutation.mutate(item.id)}
                    disabled={isAcceptingThisJob}
                  >
                    <View
                      style={{
                        backgroundColor: isAcceptingThisJob
                          ? "#ccc"
                          : "#006064",
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 6,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: 12,
                        }}
                      >
                        {isAcceptingThisJob ? "Accepting..." : "Accept Job"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
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
