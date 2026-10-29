import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useRouter } from "expo-router"; // Added useRouter
import { signUpSchema } from "../../lib/validations";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

type AuthFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize router

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AuthFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", role: "customer" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          role: data.role,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      alert(error.message);
    } else { 
     router.replace("/sign-in");
     supabase.auth.signOut();
      alert("Account created successfully! Please sign in.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 8, color: "#333" }}>
          Create Account
        </Text>
        <Text style={{ fontSize: 16, color: "#666", marginBottom: 32 }}>
          Join FixFlaws to get started.
        </Text>

        <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#333" }}>
          I want to...
        </Text>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => setValue("role", "customer")}
            style={{
              flex: 1, padding: 12, borderWidth: 2,
              borderColor: selectedRole === "customer" ? "#006064" : "#ccc",
              borderRadius: 8, alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", color: selectedRole === "customer" ? "#006064" : "#666" }}>
              Hire Help
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setValue("role", "provider")}
            style={{
              flex: 1, padding: 12, borderWidth: 2,
              borderColor: selectedRole === "provider" ? "#006064" : "#ccc",
              borderRadius: 8, alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", color: selectedRole === "provider" ? "#006064" : "#666" }}>
              Find Work
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#333" }}>
          Email
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: errors.email ? "red" : "#ccc",
                padding: 14, marginBottom: 4, borderRadius: 8, fontSize: 16, color: "#000"
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
        {errors.email && (
          <Text style={{ color: "red", marginBottom: 16, fontSize: 12 }}>
            {errors.email.message}
          </Text>
        )}
        {!errors.email && <View style={{ marginBottom: 16 }} />}

        <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#333" }}>
          Password
        </Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: errors.password ? "red" : "#ccc",
                padding: 14, marginBottom: 4, borderRadius: 8, fontSize: 16, color: "#000"
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              placeholder="Minimum 6 characters"
            />
          )}
        />
        {errors.password && (
          <Text style={{ color: "red", marginBottom: 24, fontSize: 12 }}>
            {errors.password.message}
          </Text>
        )}
        {!errors.password && <View style={{ marginBottom: 24 }} />}

        <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isLoading} activeOpacity={0.8}>
          <View
            style={{
              backgroundColor: isLoading ? "#ccc" : "#006064",
              padding: 16, borderRadius: 8, alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* FIXED: Changed the link to go to sign-in */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24 }}>
          <Text style={{ color: "#666" }}>Already have an account? </Text>
          <Link href="/sign-in" style={{ color: "#006064", fontWeight: "bold" }}>
            Sign In
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}