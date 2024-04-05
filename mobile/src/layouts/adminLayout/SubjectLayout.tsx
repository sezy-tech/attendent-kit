import {Alert, Button, FlatList, Text, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {DataTable, Modal, Portal, TextInput} from 'react-native-paper';
import roomApi from '../../api/room.api';
import {useRouter} from '../../store/router.store';
import {Controller, FieldValues, useForm} from 'react-hook-form';
import Select from '../../components/Select';
import userApi, {UserInfo} from '../../api/user.api';
import subjectApi from '../../api/subject.api';
import DatePicker from 'react-native-date-picker';

interface SubjectForm {
  name: string;
  room: string;
  students: string[];
  lecturers: string[];
  startTime: number;
  endTime: number;
  dayInWeek: number;
}
interface Room {
  _id: string;
  name: string;
}
export default function SubjectLayout() {
  const [time, setTime] = useState<Date>(new Date());
  const [time1, setTime1] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue
  } = useForm<SubjectForm>({defaultValues : {
    lecturers : ['1213131'],
    students : ['2313132']

  }});
  const onSubmit = async (data: SubjectForm) => {
    console.log(data);

     const rsp = await subjectApi.create(data)
    console.log(rsp);

  };
  const setStudentValue = () => {
    const defaultValue = ['660e89c5894cb4269dca5a49']; // Example default value
    setValue('students', defaultValue);
    setValue('lecturers', defaultValue);
  };
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [rooms, setRooms] = useState<Room[]>();
  const [students, setStudents] = useState<UserInfo[]>();
  async function fetchData() {
    const roomData = await roomApi.getAllRoom();
    const studentsData = await userApi.getAll();
    setRooms(roomData);
    setStudents(studentsData);
  }
  const lecturers = [
    {name: 'lectutur 1', _id: '123131'},
    {name: 'lectutur 2', _id: '123131'},
  ];

  const dayInWeakOptions = [
    {label: 'chu nhat', value: 1},
    {label: 'thu 2', value: 2},
    {label: 'thu 3', value: 3},
    {label: 'thu 4', value: 4},
    {label: 'thu 5', value: 5},
    {label: 'thu 6', value: 6},
    {label: 'thu 7', value: 7},
  ];
  const lecturerOptions = useMemo(
    () =>
      lecturers?.map(room => ({
        label: room.name,
        value: room._id,
      })),
    [lecturers],
  );
  const roomOptions = useMemo(
    () =>
      rooms?.map(room => ({
        label: room.name,
        value: room._id,
      })),
    [rooms],
  );
  const studentOptions = useMemo(
    () =>
      students?.map(room => ({
        label: room.email,
        value: room._id,
      })),
    [students],
  );

  useEffect(() => {
    fetchData();
    
  }, [rooms]);

  const handleEdit = async (id: string) => {
    Alert.alert('edit');
  };
  const handleDeleteRoom = async (id: string) => {
    subjectApi.delete(id);
  };
  const {navigate} = useRouter();

  return (
    <View>
      <Text>this is subject manager</Text>
      <View style={{width: 100, position: 'absolute', right: 0, padding: 10}}>
        <Button title="create subject" onPress={showModal} />
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{
              alignSelf: 'center',
              backgroundColor: 'white',
              height: 550,
              width: 300,
              padding: 10,
            }}>
            <View style={{alignSelf: 'auto', flex: 1, paddingTop: 20}}>
              <Text style={{fontSize: 20}}>form input </Text>
              <Controller
                control={control}
                name="name"
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
                      placeholder="Name"
                    />
                  </View>
                )}
              />
              <Controller
                control={control}
                name="room"
                render={({field}) => (
                  <Select
                    {...field}
                    title="Pick Room"
                    options={roomOptions ?? []}
                    style={{width: 110, paddingTop: 20}}
                    optionsStyle={{minWidth: 200}}
                  />
                )}
              />
              {/* <Controller
                control={control}
                name="lecturers"
                render={({field} : {field : FieldValues}) => (
                  <Select
                    {...field}
                    title="Pick Lecturer"
                    options={lecturerOptions ?? []}
                    style={{width: 110, paddingTop: 20}}
                    optionsStyle={{minWidth: 200}}
                   
                  />
                  
                )}
              /> */}
              {/* <Controller
                control={control}
                name="students"
                render={({field}) => (
                  // <Select
                  //   title="Pick Student"
                  //   options={studentOptions ?? []}
                  //   style={{width: 110, paddingTop: 20}}
                  //   optionsStyle={{minWidth: 200}}
                  //   {}
                  // />
                  <Button title='student def value' onPress={setStudentValue}/>
                )}
              /> */}
<Button title='student def value' onPress={setStudentValue}/>
              <Controller
                control={control}
                name="dayInWeek"
                render={({field}) => (
                  <Select
                    {...field}
                    title="day in weak"
                    options={dayInWeakOptions}
                    style={{width: 110, paddingTop: 20}}
                    optionsStyle={{minWidth: 200}}
                  />
                )}
              />
              <Controller
                control={control}
                name="startTime"
                render={({field}) => (
                  <View>
                    <Button title="start time" onPress={() => setOpen(!open)} />
                    <DatePicker
                      modal
                      open={open}
                      date={time}
                      onConfirm={date => {
                        console.log(field.onChange(date.getTime()));
                        setTime(date);
                        setOpen(false); // Close the picker after selecting
                        field.onChange(date.getTime() / 1000);
                      }}
                      onCancel={() => {
                        setOpen(false);
                      }}
                      mode="time"
                    />
                    <Text style={{fontSize: 20}}>
                      {time.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                )}
              />
              <Controller
                control={control}
                name="endTime"
                render={({field}) => (
                  <View>
                    <Button title="end time" onPress={() => setOpen1(!open1)} />
                    <DatePicker
                      {...field}
                      modal
                      open={open1}
                      date={time1}
                      onConfirm={date => {
                        setTime1(date);
                        setOpen1(false); // Close the picker after selecting
                        field.onChange(date.getTime() / 1000);
                      }}
                      onCancel={() => {
                        setOpen1(false);
                      }}
                      mode="time"
                    />
                    <Text style={{fontSize: 20}}>
                      {time1.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
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
          {/* {rooms?.map((item, index) => (
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
          ))} */}
        </DataTable>
      </View>
    </View>
  );
}
