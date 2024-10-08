import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Text, TextInput, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {DataTable, IconButton, Modal, Portal} from 'react-native-paper';
import roomApi from '../../api/room.api';
import {useRouter} from '../../store/router.store';
import Popup from '../../components/Popup';
import {SubmitHandler, useForm} from 'react-hook-form';
import Icon from '../../components/Icon';
import Header from '../../components/Header';
interface Room {
  _id: string;
  name: string;
}
interface FormField {
  _id: string;
  name: string;
}
export default function RoomLayout() {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [className, setclassName] = useState('');
  const [RoomList, setRoomList] = useState<Room[]>([]);
  const [stage, setStage] = useState<'edit' | 'add'>();
  async function fetchData() {
    const roomData = await roomApi.getAllRoom();
    setRoomList(roomData);
  }
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: {errors},
  } = useForm<FormField>();
  const onSubmit: SubmitHandler<FormField> = data => {
    roomApi.editRoom(data._id, data.name);
    hideModal();
    console.log('Submitted data:', data);
  };
  useEffect(() => {
    fetchData();
  }, [RoomList]);
  const handleAddRoom = async () => {
    const roomName = getValues('name');
    console.log(roomName);
    const rsp = await roomApi.createRoom(roomName);
    Alert.alert('create ' + rsp.name + 'room successful');
  };

  const handleDeleteRoom = async (id: string) => {
    roomApi.deleteRoom(id);
  };
  const {navigate} = useRouter();

  const handleEdit = (id: string, name: string) => {
    setStage('edit');
    showModal();
    setValue('name', name);
    setValue('_id', id);
  };
  const Create = () => {
    setStage('add');
    showModal();
    reset();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#e6f5ec'}}>
      <Header hasBack />
      <View style={{width: 100, position: 'absolute', right: 0, padding: 10}}>
        <IconButton
          icon={() => <Icon name="plus" />}
          size={10}
          onPress={Create}
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
              <Text style={{fontSize: 20}}>info class room</Text>
              <View
                style={{
                  paddingTop: 20,
                  flexDirection: 'row',
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                  paddingBottom: 8,
                  marginBottom: 25,
                }}>
                <TextInput
                  defaultValue={getValues('name')}
                  onChangeText={text =>
                    setValue('name', text, {shouldValidate: true})
                  }
                  {...register('name', {required: true})}
                  placeholder={'Room Name'}
                  style={{flex: 1, paddingVertical: 0}}
                />
              </View>
              {/* <TextInput
                label="Room Name"
                defaultValue={getValues('name')}
                onChangeText={text =>
                  setValue('name', text, {shouldValidate: true})
                }
                {...register('name', {required: true})}
              /> */}
            </View>
            {stage === 'add' ? (
              <Button title="Add" onPress={handleAddRoom} />
            ) : (
              <Button title="apply" onPress={() => onSubmit(getValues())} />
            )}
          </Modal>
        </Portal>
      </View>
      <View style={{paddingTop: 50}}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Index</DataTable.Title>
            <DataTable.Title numeric>Room Name </DataTable.Title>
            <DataTable.Title numeric style={{paddingRight: 50}}>
              Manage
            </DataTable.Title>
          </DataTable.Header>
          {RoomList.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{index}</DataTable.Cell>
              <DataTable.Cell numeric style={{paddingRight: 30}}>
                {item.name}
              </DataTable.Cell>

              <DataTable.Cell numeric>
                <IconButton
                  icon={() => <Icon name="edit" />}
                  size={10}
                  onPress={() => handleEdit(item._id, item.name)}
                />
                <IconButton
                  icon={() => <Icon name="deleteitem" />}
                  size={10}
                  onPress={() => handleDeleteRoom(item._id)}
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    </View>
  );
}
