import {Text, View} from 'react-native';
import {useEffect, useState} from 'react';
import {Avatar, Card, IconButton} from 'react-native-paper';
import userApi, { Timetable } from '../../api/user.api';
import { Header } from 'react-native/Libraries/NewAppScreen';
import Icon from '../../components/Icon';
import UnixTimestampToTime from '../../components/FormatTime';
export default function Schedule() {
  const [schedule, setSchedule] = useState<Timetable[]>([]);
  const fetchData = async () => {
    const data = await userApi.lecturerTimetable();
    console.log(data);
    setSchedule(data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const mapValueToLabel = (value: any) => {
    const dayInWeakOptions = [
      {label: 'chu nhat', value: 1},
      {label: 'thu 2', value: 2},
      {label: 'thu 3', value: 3},
      {label: 'thu 4', value: 4},
      {label: 'thu 5', value: 5},
      {label: 'thu 6', value: 6},
      {label: 'thu 7', value: 7},
    ];

    const option = dayInWeakOptions.find(option => option.value === value);
    return option ? option.label : '';
  };
  return (
    <View style={{flex: 1, backgroundColor: '#eddcf7'}}>
      <Header hasBack />
      <Text style={{alignSelf: 'center', fontSize: 20, color: '#f0441d',}}>
        Schedule In Week
      </Text>
      {schedule && schedule.length > 0 ? (
        schedule.map((sche, index) => (
          <View style={{padding: 20, gap: 5}} key={index}>
            <Card>
              <Card.Title
                key={index}
                title={sche.name}
                subtitle={``}
                left={props => <Icon name={'game'} />}
                right={props => (
                  <Icon name="check" style={{paddingRight: 20}} />
                )}
              />
              <Card.Content>
                <Text>
                  <UnixTimestampToTime unixTimestamp={sche.startTime} /> to{' '}
                  <UnixTimestampToTime unixTimestamp={sche.endTime} />
                </Text>
                <Text>Day in week: {mapValueToLabel(sche.dayInWeek)}</Text>
              </Card.Content>
            </Card>
          </View>
        ))
      ) : (
        <View style={{padding: 20, gap: 5}}>
          <Card>
            <Card.Title
              title={'....................................'}
              left={props => <Icon name={'game'} />}
            />
            <Card.Content>
              <Text>........................</Text>
              <Text>........................</Text>
              <Text>........................</Text>
            </Card.Content>
          </Card>
        </View>
      )}
    </View>
  );
}
