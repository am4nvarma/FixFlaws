import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import {supabase} from '@/lib/supabase'

export default function Index () {
  const [status, setStatus] = useState('Testing Supabase')

  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await supabase.auth.getSession();

        if (error) {
          setStatus(`Test Failed: ${error.message}`)
          return;
        }

        setStatus(`Supabase Client initiated Successfully!!`)
      } catch (error) {
        setStatus(
          `Error: ${
            error instanceof Error ? error.message : 'Unknown Error'
          }`
        );
      }
    }
    testConnection()
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      {/* <ActivityIndicator size="large" /> */}
      <Text style = {{ marginTop: 20, textAlign:'center' }}>
      {status}
      </Text>
    </View>
  )
}

