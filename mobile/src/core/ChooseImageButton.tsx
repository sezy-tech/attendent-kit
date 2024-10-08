import React from 'react';
import { Button } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

export interface ImageDetails {
  path: string;
  height: number;
  width: number;
}

interface ChooseImageButtonProps {
  onChoose: (image: ImageDetails) => void;
}

const ChooseImageButton = ({ onChoose }: ChooseImageButtonProps) => {
  const handlePress = async () => {
    await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1
    }, (response) => {
      if (response.didCancel) {
        return;
      }
      const asset = response.assets![0];
      const currentImage = {
        path: asset.uri!,
        width: asset.width!,
        height: asset.height!,
      };

      onChoose(currentImage);

    });
  };

  return <Button title="Choose an Image" onPress={handlePress} />;
};

export default ChooseImageButton;
