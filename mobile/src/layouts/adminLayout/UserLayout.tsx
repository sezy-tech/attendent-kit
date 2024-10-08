import React, {useEffect, useState} from 'react';
import {Alert, Button, Text} from 'react-native';
import {View} from 'react-native';
import {
  DataTable,
  IconButton,
  Modal,
  Portal,
  RadioButton,
  TextInput,
} from 'react-native-paper';
import roomApi from '../../api/room.api';
import {useRouter} from '../../store/router.store';
import {Controller, useForm} from 'react-hook-form';
import userApi, {UserInfo} from '../../api/user.api';
import {User} from '../../models/db.model';
import Select from '../../components/Select';
import Icon from '../../components/Icon';
import Header from '../../components/Header';
type UserInfoWithoutDeviceId = Omit<User, 'deviceId'>;

interface FormData {
  _id: string;
  password: string;
  email: string;
  phone: string;
  role: number;
}
interface Room {
  _id: string;
  name: string;
}
type EditableUserInfo = Omit<
  UserInfo,
  '__v' | 'deviceIds' | 'password' | 'role'
>;
export default function UserLayout() {
  const initData: FormData = {
    _id: '',
    password: '',
    email: '',
    phone: '',
    role: 1,
  };
  type UserInfoWithoutId = Omit<UserInfo, '_id'>;
  const {
    setValue,
    control,
    handleSubmit,
    getValues,
    reset,
    formState: {errors},
  } = useForm<FormData>({defaultValues: initData});
  const onSubmit = async (data: FormData) => {
    const {_id, ...dataWithOutId} = data;
    // console.log(dataWithOutId);
    const result = await userApi.createUser(dataWithOutId);
    hideModal();
    console.log("abc",result);
  };
  const onEditSubmit = async (data: FormData) => {
    console.log(data);
    await userApi.edit(data);
    hideModal();
  };
  
  const [stage, setStage] = useState<'edit' | 'add'>();
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [userList, setUserList] = useState<UserInfo[]>([]);
  async function fetchData() {
    const userData = await userApi.getAll();
    setUserList(userData);
  }
  const handleAdd = () => {
    reset()
    setStage('add');
    showModal();
  };
  useEffect(() => {
    fetchData();
  }, [userList]);

  const handleEditUser = async (data: UserInfo) => {
    setStage('edit');
    setValue('_id', data._id);
    setValue('email', data.email);
    setValue('phone', data.phone);
    setValue('role', data.role);
    setValue('_id', data._id);
    showModal();
  };

  const handleDeleteUser = async (id: string) => {
    // roomApi.deleteRoom(id);
    await userApi.delete(id);
    Alert.alert('delete successful');
  };

  const roleOptions = [
    {label: 'student', value: 1},
    {label: 'lecturer', value: 2},
  ];
  const {navigate} = useRouter();
  return (
    <View style={{flex: 1, backgroundColor: '#cfdec1'}}>
       <Header hasBack /> 
      <View style={{width: 100, position: 'absolute', right: 0, padding: 10}}>
        <IconButton
          icon={() => <Icon name="plus" />}
          size={10}
          onPress={handleAdd}
        />

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{
              alignSelf: 'center',
              backgroundColor: 'white',
              height: 500,
              width: 300,
              padding: 10,
            }}>
            <View style={{alignSelf: 'auto', flex: 1, paddingTop: 20}}>
              <Text style={{fontSize: 20}}>Add new user</Text>
              <Controller
                control={control}
                name="email"
                render={({field}) => (
                  <View>
                    <TextInput
                      style={{
                        height: 40,
                        width: 200,
                        borderColor: 'gray',
                        borderWidth: 1,
                      }}
                      {...field}
                      onChangeText={field.onChange}
                      placeholder="Email"
                    />
                  </View>
                )}
              />
              <Controller
                control={control}
                name="phone"
                render={({field}) => (
                  <View>
                    <TextInput
                      style={{
                        height: 40,
                        width: 200,
                        borderColor: 'gray',
                        borderWidth: 1,
                      }}
                      {...field}
                      onChangeText={field.onChange}
                      placeholder="phone"
                    />
                  </View>
                )}
              />
              {stage === 'edit' ? null : (
                <Controller
                  control={control}
                  name="password"
                  render={({field}) => (
                    <View>
                      <TextInput
                        style={{
                          height: 40,
                          width: 200,
                          borderColor: 'gray',
                          borderWidth: 1,
                        }}
                        {...field}
                        onChangeText={field.onChange}
                        placeholder="password"
                      />
                    </View>
                  )}
                />
              )}
              <Controller
                control={control}
                name="role"
                render={field => (
                  <Select
                    title="Pick role"
                    options={roleOptions ?? []}
                    style={{width: 110, paddingTop: 20}}
                    optionsStyle={{minWidth: 200}}
                    onChange={(value: any) => setValue('role', value)}
                  />
                )}
              />
            </View>
            {stage === 'add' ? (
              <Button title="add" onPress={handleSubmit(onSubmit)} />
            ) : (
              <Button title="apply" onPress={() => onEditSubmit(getValues())} />
            )}
          </Modal>
        </Portal>
      </View>
      <View style={{paddingTop: 20}}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Index</DataTable.Title>
            <DataTable.Title numeric>Email</DataTable.Title>
            <DataTable.Title numeric style={{paddingRight: 50}}>
              Manage
            </DataTable.Title>
          </DataTable.Header>
          {userList.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{index}</DataTable.Cell>
              <DataTable.Cell>{item.email}</DataTable.Cell>
              <DataTable.Cell numeric>
                <IconButton
                  icon={() => <Icon name="edit" />}
                  size={10}
                  onPress={() => handleEditUser(item)}
                />
                <IconButton
                  icon={() => <Icon name="deleteitem" />}
                  size={10}
                  onPress={() => handleDeleteUser(item._id)}
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    </View>
  );
}
