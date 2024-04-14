import {
  Button,
  ImageBackground,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import authApi from '../../api/auth.api';
import {useRouter} from '../../store/router.store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import Icon from '../../components/Icon';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
interface LoginForm {
  email: string;
  password: string;
}
const Login = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginForm>();
  const onSubmit: SubmitHandler<LoginForm> = async data => {
    try {
      await authApi.login(data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
    navigate('');
  };
  const {navigate} = useRouter();

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center'}}></View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          Login
        </Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          name="email"
          render={({field: {onChange, onBlur, value}}) => (
            <View
              style={{
                flexDirection: 'row',
                borderBottomColor: '#ccc',
                borderBottomWidth: 1,
                paddingBottom: 8,
                marginBottom: 25,
              }}>
              <Icon name={'email'} />
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder={'E-mail'}
                style={{flex: 1, paddingVertical: 0}}
              />
            </View>
          )}
        />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          name="password"
          render={({field: {onChange, onBlur, value}}) => (
            <View
              style={{
                flexDirection: 'row',
                borderBottomColor: '#ccc',
                borderBottomWidth: 1,
                paddingBottom: 8,
                marginBottom: 25,
              }}>
              <Icon name={'key'} />
              <TextInput
                onChangeText={onChange}
                value={value}
                style={{flex: 1, paddingVertical: 0}}
                secureTextEntry={true}
              />
            </View>
          )}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={{
            backgroundColor: '#AD40AF',
            padding: 20,
            borderRadius: 10,
            marginBottom: 30,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 16,
              color: '#fff',
            }}>
            Login
          </Text>
        </TouchableOpacity>

        <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
          Or, login with ...
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}></View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}></View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
