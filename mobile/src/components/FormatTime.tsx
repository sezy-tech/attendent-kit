import React from 'react';
import { Text } from 'react-native';

const UnixTimestampToTime = ({ unixTimestamp }:any) => {
  const convertUnixTimeToTime = (unixTimestamp : any) => {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formattedTime = convertUnixTimeToTime(unixTimestamp);

  return <Text>{formattedTime}</Text>;
};

export default UnixTimestampToTime;