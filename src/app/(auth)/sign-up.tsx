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
import { Link } from "expo-router";
import { authSchema } from "../../lib/validations";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { is } from "zod/v4/locales";

// Infer the TypeScript type from the Zod schema automatically
type AuthFormData = z.infer<typeof authSchema>;

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  // 1. Set up the form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  // 2. This runs ONLY when validation passes
  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    // Call Supabase Auth
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);

    if (error) {
      // Show the error from Supabase (e.g., "User already registered")
      alert(error.message);
    } else {
      // success
      alert("Account created! Please check your email to verify your account.");
      // Later, we will route them to the login screen or the app here
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
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 8,
            color: "#333",
          }}
        >
          Create Account
        </Text>
        <Text style={{ fontSize: 16, color: "#666", marginBottom: 32 }}>
          Join FixFlaws to get started.
        </Text>

        {/* EMAIL INPUT */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 6,
            color: "#333",
          }}
        >
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
                padding: 14,
                marginBottom: 4,
                borderRadius: 8,
                fontSize: 16,
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

        {/* PASSWORD INPUT */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 6,
            color: "#333",
          }}
        >
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
                padding: 14,
                marginBottom: 4,
                borderRadius: 8,
                fontSize: 16,
                color: "black",
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

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <View
            style={{
              backgroundColor: isLoading ? "#ccc" : "#006064",
              padding: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* GO TO LOGIN LINK */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          <Text style={{ color: "#666" }}>Already have an account? </Text>
          <Link
            href="/sign-up"
            style={{ color: "#006064", fontWeight: "bold" }}
          >
            Sign In
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
