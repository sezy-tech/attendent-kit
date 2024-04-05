import { Button, Text, TextInput, View } from "react-native"
import authApi from "../../api/auth.api"
import { useRouter } from "../../store/router.store"
const Login = () => {
    const { navigate } = useRouter()
    const login = async () => {
        try {
            const aa = await authApi.login({
                "email": "test@gmail.com",
                "password": "Abc123456"
            })
            navigate('/dashboard')

        } catch (e) {
            console.log(e)
        }
    }
    return (
        <View>
            <Text>Login</Text>
            <TextInput placeholder="Email" />
            <TextInput placeholder="Password" keyboardType='visible-password' />
            <Button onPress={login} title="Login" />
        </View>
    )
}

export default Login