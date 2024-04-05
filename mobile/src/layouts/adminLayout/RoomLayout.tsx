import React, {useEffect, useState} from 'react';
import {Alert, Button, Text} from 'react-native';
import {View} from 'react-native';
import {DataTable, Modal, Portal, TextInput} from 'react-native-paper';
import roomApi from '../../api/room.api';
import { useRouter } from '../../store/router.store';
interface Room {
  _id : string,
  name :string,
}
export default function RoomLayout(){
    
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [className, setclassName]= useState('')
  const [RoomList,setRoomList]= useState<Room[]>([])
 async function fetchData(){
  const roomData =await roomApi.getAllRoom()
  setRoomList(roomData)
 }

  useEffect(() => {
    fetchData()
  }, [RoomList]);
  const handleAddRoom= async (name : string)=>{
  const rsp =  await roomApi.createRoom(name)
  Alert.alert('create ' + rsp.name +'room successful')
  }
  const handleEditRoom= async (id : string)=>{
    Alert.alert('edit')
    }
    const handleDeleteRoom= async (id : string)=>{
      roomApi.deleteRoom(id)
      }
      const {navigate} = useRouter()
    return(
        <View>
        <Text>this is admin dashboard</Text>
        <View style={{width: 100, position: 'absolute', right: 0, padding: 10}}>
          <Button title="create room" onPress={showModal} />
          <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{alignSelf:'center',backgroundColor: 'white',height : 500,width : 300, padding :10}}>
            <View style={{alignSelf:'auto',flex:1,paddingTop:20}}>
              <Text style={{fontSize:20}}>
                info class room
              </Text>
            <TextInput
        label="Room Name"
        value={className}
        onChangeText={text => setclassName(text)}
      />
      
            </View>
            <Button title="add" onPress={()=>handleAddRoom(className)} />
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
              <DataTable.Title numeric style={{paddingRight:50}} >manage</DataTable.Title>
            </DataTable.Header>
            {RoomList.map((item,index) => (
          <DataTable.Row key={index}>
              <DataTable.Cell>{index}</DataTable.Cell>
            <DataTable.Cell numeric>{item.name}</DataTable.Cell>
            <DataTable.Cell numeric>
              <Button onPress={()=>handleEditRoom(item._id)} title='edit' />
            </DataTable.Cell>
            <DataTable.Cell numeric>
            <Button onPress={()=>handleDeleteRoom(item._id)} title='delete' />
            </DataTable.Cell>
          </DataTable.Row>
        ))}
          </DataTable>
        </View>
      </View>
    )
}