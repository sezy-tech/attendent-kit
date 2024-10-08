import React, { ReactNode, useState } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import theme from '../styles/theme.style';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { useRouter } from '../store/router.store';
import Icon from './Icon';

interface HeaderProps {
  hasBack?: boolean;
  suffix?: ReactNode;
}
function Header({
  hasBack = false,
  children,
  suffix,
}: HeaderProps & ViewProps) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  // const logoSource = require('../../../assets/images/logo.jpeg');

  const routerHisory = router.getHistory();

  return (
    <View style={[styles.wrapper]}>
      {hasBack &&
        routerHisory.length > 1 &&
        routerHisory[routerHisory.length - 2].path !== '' && (
          <TouchableHighlight
            onPress={router.back as any}
            underlayColor={theme.btn.wrapper.underlayColor}
          >
            <Icon name='arrow_left' />
          </TouchableHighlight>
        )}
      {children}
      {suffix}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: theme.header.paddingHorizontal,
    paddingVertical: theme.header.paddingVertical,
  },
  title: {
    fontSize: 20,
    textTransform: 'capitalize',
  },
});

export default Header;
