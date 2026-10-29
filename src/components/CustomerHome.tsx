import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";

export default function CustomerHome() {
  const { user } = useAuthStore();
  const router = useRouter();

  // we will display the customers most recent jobs as a dashboard

  const { data: recentJobs } = useQuery({
    queryKey: ["my-jobs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
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
        Hello, Sir
      </Text>
      <Text
        style={{ fontSize: 16, color: "#666", marginTop: 8, marginBottom: 24 }}
      >
        Something need's to get Fixed today ??
      </Text>

      {/* Quick Action Button */}

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/create-job")}
        style={{
          backgroundColor: "#006064",
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
            Post A new Job
          </Text>
          <Text style={{ color: "#e0f7fa", marginTop: 4 }}>
            Get Help From Pro's
          </Text>
        </View>
        <Text style={{ color: "#fff", fontSize: 24 }}>+</Text>
      </TouchableOpacity>

      {/* Recent Activity */}

      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 12,
        }}
      >
        Your Recent Requests
      </Text>

      {recentJobs?.length === 0 ? (
        <Text style={{ color: "#888", fontStyle: "italic" }}>
          You haven't posted any jobs yet.
        </Text>
      ) : (
        recentJobs?.map((job) => (
          <View
            key={job.id}
            style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 8,
              marginBottom: 10,
              borderLeftWidth: 4,
              borderLeftColor: "#006064",
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
        onPress={() => router.push("/(tabs)/my-jobs")}
        style={{ marginTop: 10 }}
      >
        <Text
          style={{ color: "#006064", fontWeight: "bold", textAlign: "center" }}
        >
          View All Requests
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
