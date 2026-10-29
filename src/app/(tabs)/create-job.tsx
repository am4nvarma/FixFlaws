import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

// Validation Schema
const jobSchema = z.object({
  title: z.string().min(5, "Title must be atleast of 5 letters"),
  description: z.string().min(10, "Description must be of 10 letters"),
  category: z.string().min(3, "Please Breif Category"),
  address: z.string().min(5, "Address is required"),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function CreateJob() {
  const router = useRouter();
  const queryClient = useQueryClient(); // to refresh the jobs

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: { title: "", description: "", category: "", address: "" },
  });

  // The Mutation (writing data)
  const createJobMutation = useMutation({
    mutationFn: async (newJob: JobFormData) => {
      // Get the currently Logged-in User
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not Logged In");

      // Insert Into Supabase
      const { error } = await supabase.from("jobs").insert({
        ...newJob,
        customer_id: user.id, // Attach the user id
        status: "Open",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      // Tell React Query to Refresh the 'jobs' list because we just added one!
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs', ] }); 
      Alert.alert("Success", "Job Posted Successfully!");
      router.back(); // to go back to jobs feed
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const onSubmit = (data: JobFormData) => {
    createJobMutation.mutate(data); // Trigger The Mutation
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Post New Job
      </Text>

      {/* Title Input */}
      <Text style={{ fontWeight: "600", marginBottom: 6 }}>Job Title</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.title ? "red" : "#ccc",
              padding: 10,
              borderRadius: 5,
              marginBottom: 4,
              color: "#000",
            }}
            onChangeText={onChange}
            value={value}
            placeholder="e.g Fix leaking Kitchen sink"
          />
        )}
      />
      {errors.title && (
        <Text style={{ color: "red", marginBottom: 10, fontSize: 12 }}>
          {errors.title.message}
        </Text>
      )}

      {/* Category Input */}
      <Text style={{ fontWeight: "600", marginBottom: 6 }}>Category</Text>
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.category ? "red" : "#ccc",
              padding: 10,
              borderRadius: 5,
              marginBottom: 4,
              color: "#000",
            }}
            onChangeText={onChange}
            value={value}
            placeholder="e.g Plumbing Work"
          />
        )}
      />
      {errors.category && (
        <Text style={{ color: "red", marginBottom: 10, fontSize: 12 }}>
          {errors.category.message}
        </Text>
      )}

      {/* Address Input */}
      <Text style={{ fontWeight: "600", marginBottom: 6 }}>Address</Text>
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.address ? "red" : "#ccc",
              padding: 12,
              borderRadius: 8,
              marginBottom: 4,
              color: "#000",
            }}
            onChangeText={onChange}
            value={value}
            placeholder="Where is the job located?"
          />
        )}
      />
      {errors.address && (
        <Text style={{ color: "red", marginBottom: 10, fontSize: 12 }}>
          {errors.address.message}
        </Text>
      )}

      {/* Description Input */}
      <Text style={{ fontWeight: "600", marginBottom: 6 }}>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.description ? "red" : "#ccc",
              padding: 12,
              borderRadius: 8,
              marginBottom: 4,
              height: 100,
              textAlignVertical: "top",
              color: "#000",
            }}
            onChangeText={onChange}
            value={value}
            placeholder="Describe the problem in detail..."
            multiline
          />
        )}
      />
      {errors.description && (
        <Text style={{ color: "red", marginBottom: 10, fontSize: 12 }}>
          {errors.description.message}
        </Text>
      )}

      <TouchableOpacity onPress={handleSubmit(onSubmit)}
      disabled={createJobMutation.isPending} 
      style={{ marginTop: 10 }}>
        <View style = {{ backgroundColor: createJobMutation.isPending ? '#ccc' : '#006064', padding: 16, borderRadius: 8, alignItems: 'center' }}>
        <Text>
            {createJobMutation.isPending ? "Posting..." : "Post Job"}
        </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
