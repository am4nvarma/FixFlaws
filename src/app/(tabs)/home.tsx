import { Text, View, Button, TouchableOpacity } from "react-native";
import { useAuthStore } from '../../store/useAuthStore'
import { useRouter } from "expo-router";


export default function Home() {
    // Extracting Values From The Store

    const { role, isLoggedIn, setRole, logout } = useAuthStore();
    const router = useRouter();

    return (
        
    <View style = {{ flex: 1, justifyContent:'center', alignItems:'center', padding:20}}>
    <Text style = {{fontSize: 20, fontWeight:'condensedBold', marginBottom: 20}}> FixFlaw's Home</Text>
    {/* Showing Current State */}
    <Text>
        Current Role : {role || "Not Logged In"}
    </Text>

    {/* options to change global states */}
    <View style={{ gap:15, marginTop:20}}>
        <Button 
        title='Login As Customer'
        onPress={() => setRole('customer') }/>
        <Button 
        title='Login As Provider'
        onPress={() => setRole('provider')}/>
        <Button 
        title='Logout'
        onPress={logout} color={'red'}/>    

            <TouchableOpacity
            onPress={() => router.push('/(auth)/sign-up')}
            style={{ backgroundColor:'#006064', padding:12, borderRadius:5, marginBottom:20, alignItems:"center"}}
            >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    Go to Sign Up
                </Text>
            </TouchableOpacity>

    </View>
    </View>
    )
}