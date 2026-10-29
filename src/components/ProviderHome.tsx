import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";

export default function ProviderHome() {
  const { user } = useAuthStore();
  const router = useRouter();

  // we will display the Providers Active jobs as a dashboard

  const { data: activeJobs } = useQuery({
    queryKey: ["my-assigned-jobs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("provider_id", user?.id)
        .neq("status", "completed")
        .limit(2);
      return data || [];
    },
    enabled: !!user,
  });
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 20 }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#333",
          marginTop: 20,
        }}
      >
        Ready to work? 🛠️
      </Text>
      <Text
        style={{ fontSize: 16, color: "#666", marginTop: 8, marginBottom: 24 }}
      >
        Check your schedule and find new gigs.
      </Text>

      {/* Quick Action Button */}

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/jobs")}
        style={{
          backgroundColor: "#ff3d3d",
          padding: 20,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 30,
        }}
      >
        <View>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
            Find New Jobs
          </Text>
          <Text style={{ color: "#ffcccc", marginTop: 4 }}>
            Browse the job feed
          </Text>
        </View>
        <Text style={{ color: "#fff", fontSize: 24 }}>→</Text>
      </TouchableOpacity>

      {/* Active Jobs Summary */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 12,
        }}
      >
        Your Active Jobs
      </Text>

      {activeJobs?.length === 0 ? (
        <Text style={{ color: "#888", fontStyle: "italic" }}>
          No active jobs right now. Time to find work!
        </Text>
      ) : (
        activeJobs?.map((job) => (
          <View
            key={job.id}
            style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 8,
              marginBottom: 10,
              borderLeftWidth: 4,
              borderLeftColor: "#ff3d3d",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {job.title}
            </Text>
            <Text style={{ color: "#666", marginTop: 4 }}>
              Status: {job.status}
            </Text>
          </View>
        ))
      )}

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/my-assigned-jobs")}
        style={{ marginTop: 10 }}
      >
        <Text
          style={{ color: "#ff3d3d", fontWeight: "bold", textAlign: "center" }}
        >
          Manage All Jobs
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
