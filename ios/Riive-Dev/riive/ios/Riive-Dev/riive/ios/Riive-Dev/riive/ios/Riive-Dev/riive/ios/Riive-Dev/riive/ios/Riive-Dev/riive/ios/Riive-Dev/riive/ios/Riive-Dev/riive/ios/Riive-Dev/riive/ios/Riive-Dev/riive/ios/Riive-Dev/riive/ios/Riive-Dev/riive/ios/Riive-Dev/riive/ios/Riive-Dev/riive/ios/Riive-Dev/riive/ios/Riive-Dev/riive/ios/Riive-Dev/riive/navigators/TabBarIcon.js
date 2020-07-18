import React from 'react';
import { Feather } from '@expo/vector-icons';

import Colors from '.././constants/Colors';

export default function TabBarIcon(props) {
  return (
    <Feather
      name={props.name}
      size={28}
      style={{ marginBottom: 2}}
      color={props.focused ? Colors.tango700 : Colors.cosmos300}
    />
  );
}