import { Button, Text, TextInput, View } from "react-native"
import authApi from "../../api/auth.api"
import useCustomNavigation from "../../core/hooks/useCustomNavigation";

const Login = () => {
    const { navigate } = useCustomNavigation()
    const login = async () => {
        try {
            const aa = await authApi.login({
                "email": "lthtv8@gmail.com",
                "password": "Abc123456"
            })
            navigate('Home')

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