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
export default function Dashboard() {




  
      const {navigate} = useRouter()
  return (
   
    <View>
      <Button onPress={()=>navigate('/room')} title='create Room'/>
      <Button onPress={()=>navigate('/admin/user')} title='create User'/>
      <Button onPress={()=>navigate('/admin/subject')} title='create subject'/>
      <Button onPress={()=>navigate('admin/user')} title='create class'/>
    </View>
  );
}
