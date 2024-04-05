import React, {useEffect, useState} from 'react';
import {Alert, Button, Text} from 'react-native';
import {View} from 'react-native';
import {DataTable, Modal, Portal, TextInput} from 'react-native-paper';
import roomApi from '../../api/room.api';
import {useRouter} from '../../store/router.store';
import {Controller, useForm} from 'react-hook-form';
import userApi from '../../api/user.api';

interface FormData {
  password: string;
  email: string;
  phone: string;
  role: number;
}
interface Room {
  _id: string;
  name: string;
}

export default function UserLayout() {
  const initData: FormData = {
    password: '',
    email: '',
    phone: '',
    role: 1,
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({defaultValues: initData});
  const onSubmit = async (data: FormData) => {
   const result = await userApi.createUser(data)
   console.log(result)
  };

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [RoomList, setRoomList] = useState<Room[]>([]);
  async function fetchData() {
    const roomData = await roomApi.getAllRoom();
    setRoomList(roomData);
  }

  useEffect(() => {
    fetchData();
  }, [RoomList]);

  const handleEditRoom = async (id: string) => {
    Alert.alert('edit');
  };
  const handleDeleteRoom = async (id: string) => {
    roomApi.deleteRoom(id);
  };
  const {navigate} = useRouter();
  return (
    <View>
      <Text>this is admin dashboard</Text>
      <View style={{width: 100, position: 'absolute', right: 0, padding: 10}}>
        <Button title="create user" onPress={showModal} />
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
              <Text style={{fontSize: 20}}>form input user</Text>
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

             
            </View>
            <Button title="add" onPress={handleSubmit(onSubmit)} />
          </Modal>
        </Portal>
      </View>
      <View style={{paddingTop: 50}}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title sortDirection="descending">
              Dessert
            </DataTable.Title>
            <DataTable.Title numeric>name (g)</DataTable.Title>
            <DataTable.Title numeric style={{paddingRight: 50}}>
              manage
            </DataTable.Title>
          </DataTable.Header>
          {RoomList.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{index}</DataTable.Cell>
              <DataTable.Cell numeric>{item.name}</DataTable.Cell>
              <DataTable.Cell numeric>
                <Button onPress={() => handleEditRoom(item._id)} title="edit" />
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Button
                  onPress={() => handleDeleteRoom(item._id)}
                  title="delete"
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    </View>
  );
}
