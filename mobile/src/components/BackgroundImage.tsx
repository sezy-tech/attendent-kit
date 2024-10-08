import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface BackgroundImageProps {
  source: any;
}

function BackgroundImage({ source }: BackgroundImageProps) {
  return <Image source={source} style={styles.bg} resizeMode='cover' />;
}

const styles = StyleSheet.create({
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default BackgroundImage;
