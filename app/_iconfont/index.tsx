/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';
import IconEmpty from './IconEmpty';
import IconSetting from './IconSetting';
export { default as IconEmpty } from './IconEmpty';
export { default as IconSetting } from './IconSetting';

export type IconNames = 'empty' | 'setting';

interface Props extends GProps, ViewProps {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

let IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'empty':
      return <IconEmpty key="1" {...rest} />;
    case 'setting':
      return <IconSetting key="2" {...rest} />;
  }

  return null;
};

IconFont = React.memo ? React.memo(IconFont) : IconFont;

export default IconFont;
