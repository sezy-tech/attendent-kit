import {
  Alert,
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Card,
  DataTable,
  IconButton,
  List,
  Modal,
  Portal,
} from 'react-native-paper';
import roomApi from '../../api/room.api';
import {useRouter} from '../../store/router.store';
import {Controller, FieldValues, useForm} from 'react-hook-form';
import Select from '../../components/Select';
import userApi, {UserInfo} from '../../api/user.api';
import subjectApi, {SubjectForm} from '../../api/subject.api';
import DatePicker from 'react-native-date-picker';
import Popup from '../../components/Popup';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from '../../components/Icon';
import Header from '../../components/Header';

interface Room {
  _id: string;
  name: string;
}
export default function SubjectLayout() {
  const [time, setTime] = useState<Date>(new Date());
  const [time1, setTime1] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [rooms, setRooms] = useState<Room[]>();
  const [subjects, setSubjects] = useState<SubjectForm[]>([]);
  const [lecTemp, setLecTemp] = useState<string[]>([]);
  const [stage, setStage] = useState<'edit' | 'add'>();
  const {navigate} = useRouter();

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    getValues,
    reset,
  } = useForm<SubjectForm>({});
  const onSubmit = async (data: SubjectForm) => {
    try {
      await subjectApi.create(data);
      Alert.alert('create subject ' + data.name + ' succesful');
    } catch (e) {
      console.log(e);
    }
    hideModal();
  };

  const onEditSubmit = async (data: SubjectForm) => {
    try {
      await subjectApi.edit(data);
      Alert.alert('edit succescful');
    } catch (e) {
      console.log(e);
    }
    hideModal();
  };
  async function fetchData() {
    const roomData = await roomApi.getAllRoom();
    const subjectsData = await subjectApi.getAll();
    setSubjects(subjectsData);
    setRooms(roomData);
  }
  const lecturers = [
    {name: 'lectutur 1', _id: '660a21a646a5f9964e7bbdc3'},
    {name: 'lectutur 2', _id: '660a48e27fa8177eb131ea98'},
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
      lecturers?.map(lec => ({
        label: lec.name,
        value: lec._id,
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

  const handleEdit = async (data: SubjectForm) => {
    setStage('edit');
    setValue('_id', data._id);
    setValue('dayInWeek', data.dayInWeek);
    setValue('endTime', data.endTime);
    setValue('lecturers', data.lecturers);
    setValue('name', data.name);
    setValue('room', data.room);
    setValue('startTime', data.startTime);
    setValue('students', data.students);
    console.log(data);
    showModal();
  };
  const handleDelete = async (id: string) => {
    subjectApi.delete(id);
  };
  const popupRef = useRef<any>(null);
  const handleOpenPopup = () => {
    popupRef.current.open();
  };
  useEffect(() => {
    fetchData();
  }, [rooms]);
  const handleAddLecturer = (lecturerid: any) => {
    setLecTemp([...lecTemp, lecturerid]);
    setValue('lecturers', lecTemp);
  };
  const handleAdd = () => {
    reset();
    setStage('add');
    showModal();
  };
  const getPopupContent = () => {
    const [students, setStudents] = useState<UserInfo[]>([]);
    const [selected, setSelected] = useState<UserInfo[]>([]);
    const [temp, setTemp] = useState<string[]>([]);
    async function fetchData() {
      const studentsData = await userApi.getAll();
      setStudents(studentsData);
    }
    useEffect(() => {
      fetchData();
    }, []);

    const handleAddStudent = (student: UserInfo) => {
      setTemp([...temp, student._id]);
      const newSelected = [...selected, student];
      setSelected(newSelected);
      const index = students.findIndex(s => s._id === student._id);
      console.log(index);
      const newStudents = [
        ...students.slice(0, index),
        ...students.slice(index + 1),
      ];
      setStudents(newStudents);
    };

    const handleApply = () => {
      console.log(temp);
      setValue('students', temp);
      popupRef.current.close();
    };
    const handleClose = () => {
      setSelected([]);
      setTemp([]);
      fetchData(); // Refetch students to reset the list
      popupRef.current.close();
    };

    return (
      <View
        style={{flex: 1, height: 550, width: 300, backgroundColor: '#faecc5'}}>
        <Card.Actions style={{gap: 5}}>
          <Button title="Apply" onPress={handleApply} />
          <Button color={'#e80c34'} title="Cancel" onPress={handleClose} />
        </Card.Actions>
        <Card style={{height: 275, backgroundColor: '#faecc5'}}>
          <Card.Title
            title={'Selected Student'}
            subtitle={``}
            left={props => <Icon name={'relationship'} />}
          />
          <Card.Content>
            <ScrollView style={{flexDirection: 'column'}}>
              {selected &&
                selected.map((stu, index) => (
                  <TouchableOpacity key={index} onPress={() => {}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text>{stu.email}</Text>
                      <View
                        style={{
                          marginLeft: 'auto', // Pushes the icon to the right
                          right: 5,
                        }}>
                        <Icon onPress={() => {}} width={15} name="times" />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </Card.Content>
        </Card>
        <Card style={{height: 275}}>
          <Card.Title
            title={'Student List'}
            subtitle={``}
            left={props => <Icon name={'relationship'} />}
          />
          <Card.Content>
            <ScrollView style={{flexDirection: 'column'}}>
              {students &&
                students.map((stu, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleAddStudent(stu)}>
                    <View style={{flexDirection: 'row'}}>
                      <Text>{stu.email}</Text>
                      <View
                        style={{
                          marginLeft: 'auto', // Pushes the icon to the right
                          right: 5,
                        }}>
                        <Icon width={15} name="plus" />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </Card.Content>
        </Card>
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: '#dff5ed'}}>
        <Header hasBack /> 
      <View style={{width: 100, position: 'absolute', right: 0, padding: 10}}>
        {/* <Button title="create subject" onPress={showModal} />
         */}
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
              height: 550,
              width: 300,
              padding: 10,
            }}>
            <View style={{alignSelf: 'auto', flex: 1, paddingTop: 20}}>
              <Text style={{fontSize: 20}}>Subject Form Input </Text>
              <Controller
                control={control}
                name="name"
                render={({field}) => (
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
                      {...field}
                      onChangeText={field.onChange}
                      placeholder={'Subject Name'}
                      style={{flex: 1, paddingVertical: 0}}
                    />
                  </View>
                )}
              />
              <TouchableOpacity onPress={handleOpenPopup}>
                <Card.Title
                  title="Add Student"
                  left={props => <Icon title="game" name={'plus'} />}
                />
              </TouchableOpacity>
              <Card.Title
                title="Add Lecturer"
                left={props => <Icon title="game" name={'plus'} />}
              />
              {/* <Card>
                  <Card.Actions style={{gap:5,}}>
                    <Button title="Add student" onPress={handleOpenPopup} />
                    <Button title="Add lecturer" onPress={handleOpenPopup} />
                  </Card.Actions>
                </Card> */}
              {/* <Button title="Add student" onPress={handleOpenPopup} /> */}
              <Popup ref={popupRef} content={getPopupContent} />
              {/* <Controller
                control={control}
                name="lecturers"
                render={field => (
                  <Select
                    title="Pick Lecturer"
                    options={lecturerOptions ?? []}
                    style={{width: 110, paddingTop: 20}}
                    optionsStyle={{minWidth: 200}}
                    onChange={value => handleAddLecturer(value)}
                  />
                )}
              /> */}
              <Controller
                control={control}
                name="room"
                render={({field}) => (
                  <Select
                  onChange={(value: any) => setValue('room', value)}
                    defaultValue={getValues('room')}
                    title="Pick Room"
                    options={roomOptions ?? []}
                    style={{
                      width: 200,
                      paddingTop: 20,
                    }}
                    optionsStyle={{minWidth: 200}}
                  />
                )}
              />
              <Controller
                control={control}
                name="dayInWeek"
                render={({field}) => (
                  <Select
                    defaultValue={getValues('dayInWeek')}
                    title="day in Week"
                    onChange={(value: any) => setValue('dayInWeek', value)}
                    options={dayInWeakOptions}
                    style={{
                      width: 200,
                      paddingTop: 20,
                    }}
                  />
                )}
              />
              <View style={{flexDirection: 'row', gap: 5, paddingTop: 20}}>
                <Icon name="clock" />
                <Controller
                  control={control}
                  name="startTime"
                  render={({field}) => (
                    <View>
                      <DatePicker
                        modal
                        open={open}
                        date={time}
                        onConfirm={date => {
                          setTime(date);
                          setOpen(false); // Close the picker after selecting
                          field.onChange(date.getTime() / 1000);
                        }}
                        onCancel={() => {
                          setOpen(false);
                        }}
                        mode="time"
                      />
                      <TouchableOpacity onPress={() => setOpen(!open)}>
                        <Text style={{fontSize: 20}}>
                          From{' '}
                          {time.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
                <Controller
                  control={control}
                  name="endTime"
                  render={({field}) => (
                    <View>
                      {/* <Button title="end time" onPress={() => setOpen1(!open1)} /> */}
                      <DatePicker
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
                      <TouchableOpacity onPress={() => setOpen1(!open1)}>
                        <Text style={{fontSize: 20}}>
                          To{' '}
                          {time1.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            </View>
            {/* <Button title="add" onPress={handleSubmit(onSubmit)} /> */}
            {stage === 'add' ? (
              <Button title="Add" onPress={handleSubmit(onSubmit)} />
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
            <DataTable.Title numeric>Subject Name</DataTable.Title>
            <DataTable.Title numeric style={{paddingRight: 50}}>
              Manage
            </DataTable.Title>
          </DataTable.Header>
          {subjects?.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{index}</DataTable.Cell>
              <DataTable.Cell numeric style={{paddingRight: 20}}>
                {item.name}
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <IconButton
                  icon={() => <Icon name="edit" />}
                  size={10}
                  onPress={() => handleEdit(item)}
                />
                <IconButton
                  icon={() => <Icon name="deleteitem" />}
                  size={10}
                  onPress={() => handleDelete(item._id)}
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    </View>
  );
}
