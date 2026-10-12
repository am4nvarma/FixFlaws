import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Day One Of FixFlaws</Text>
      <Text>We Are An Mobile Application</Text>
      <Text>Meant To Help Peoples</Text>
      <Text>By Connecting Service Providers</Text>
      <Text>With The Needy Ones</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
