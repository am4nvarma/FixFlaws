import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from '@hookform/resolvers'
import { z } from "zod";
import { Link, useRouter } from "expo-router";
import { authSchema } from "@/lib/validations";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";

type AuthFormData = z.infer<typeof authSchema>;

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setIsLoading(false);
    if (error) {
      alert(error.message);
    } else {
      router.replace("/(tabs)/jobs");
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
          Welcome Back
        </Text>
        <Text style={{ fontSize: 16, color: "#666", marginBottom: 32 }}>
          Sign in to continue to FixFlaws.
        </Text>

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
                color: "#000",
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
        {errors.email && <Text style={{color: 'red', marginBottom: 16, fontSize: 12}}>
            {errors.email.message}
            </Text>}
        {!errors.email && <View style = {{ marginBottom: 15}}/>}

        <Text style = {{ fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#333' }}>
            Password
        </Text>
        <Controller
        control={control}
        name="password"
        render={({ field: {onChange, onBlur, value } }) => (
            <TextInput 
            style={{ 
                borderWidth: 1, 
                borderColor: errors.password ? 'red' : '#ccc', 
                padding: 14, marginBottom: 4, borderRadius: 8, fontSize: 16, 
                color: '#000' }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry placeholder="Minimum 6 characters"
                />
        )}
        />
            {errors.password && <Text style={{ color: 'red', marginBottom: 24, fontSize: 12 }}>{errors.password.message}</Text>}
            {!errors.password && <View style={{ marginBottom: 24 }} />}
                
                <TouchableOpacity 
                onPress={handleSubmit(onSubmit)} 
                disabled={isLoading} 
                style={{ backgroundColor: isLoading ? '#ccc' : '#006064', padding: 16, borderRadius: 8, alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{isLoading ? "Signing In..." : "Sign In"}</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
                    <Text style={{ color: '#666' }}>Don't have an account? </Text>
                    <Link href="/(auth)/sign-up" style={{ color: '#006064', fontWeight: 'bold' }}>Sign Up</Link>
                </View>
                
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
