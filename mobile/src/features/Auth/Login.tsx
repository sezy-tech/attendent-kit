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
import { useRouter } from '../../store/router.store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useRef } from 'react';
import Icon from '../../components/Icon';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import BackgroundImage from '../../components/BackgroundImage';
import LoadingIcon from '../../components/LoadingIcon';
interface LoginForm {
  studentId: string;
  password: string;
}
const Login = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch, // Use watch to track input values
  } = useForm<LoginForm>();
  const [loading, setLoading] = React.useState(false);
  const usernameRef = useRef<any>(null);

  // Watch the values of studentId and password
  const studentId = watch('studentId');
  const password = watch('password');

  const onSubmit: SubmitHandler<LoginForm> = async data => {
    setLoading(true);
    try {
      // data.email = data.email.toLowerCase()
      await authApi.login(data);
      console.log('Login successful:', data);
      navigate('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle known Axios errors
        // console.error('Axios error:', error.response?.data || error.message);
        console.error(error);
      } else {
        // Handle unknown errors
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const { navigate } = useRouter();
  useEffect(() => {
    // Auto-focus the TextInput when the component mounts
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const disabled = loading || !studentId || !password;

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <View style={{ paddingHorizontal: 24, paddingVertical:40, marginHorizontal:40, borderRadius: 20, backgroundColor: '#fff' }}>
          <View style={{ alignItems: 'center' }}></View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '500',
              color: '#333',
              marginBottom: 30,
              textAlign: 'center',
            }}>
            Login
          </Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            name="studentId"
            render={({ field: { onChange, onBlur, value } }) => (
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
                  ref={usernameRef}
                  onChangeText={onChange}
                  value={value}
                  placeholder={'Student ID'}
                  style={{ flex: 1, paddingVertical: 0, fontSize: 16 }}
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
            render={({ field: { onChange, onBlur, value } }) => (
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
                  style={{ flex: 1, paddingVertical: 0, fontSize: 16 }}
                  secureTextEntry={true}
                  placeholder={'Password'}
                />
              </View>
            )}
          />
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={disabled}
            style={{
              backgroundColor: disabled ? '#888' : '#AD40AF',
              height: 60,
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '700',
                fontSize: 18,
                color: '#fff',
              }}>
              {
                loading ? <LoadingIcon /> : 'Login'
              }
            </Text>
          </TouchableOpacity>
        </View>

      </View>

      <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 12,
        }}>
        v1.0.0
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 30,
        }}></View>
    </SafeAreaView>
  );
};

export default Login;
