/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';
import IconGoBack from './IconGoBack';
import IconSearch from './IconSearch';
import IconSetting from './IconSetting';
import IconFilter from './IconFilter';
import IconUser from './IconUser';
import IconList from './IconList';
import IconCheck from './IconCheck';
import IconGoToLink from './IconGoToLink';
import IconEmpty from './IconEmpty';
export { default as IconGoBack } from './IconGoBack';
export { default as IconSearch } from './IconSearch';
export { default as IconSetting } from './IconSetting';
export { default as IconFilter } from './IconFilter';
export { default as IconUser } from './IconUser';
export { default as IconList } from './IconList';
export { default as IconCheck } from './IconCheck';
export { default as IconGoToLink } from './IconGoToLink';
export { default as IconEmpty } from './IconEmpty';

export type IconNames = 'go-back' | 'search' | 'setting' | 'filter' | 'user' | 'list' | 'check' | 'go-to-link' | 'empty';

interface Props extends GProps, ViewProps {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

let IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'go-back':
      return <IconGoBack key="1" {...rest} />;
    case 'search':
      return <IconSearch key="2" {...rest} />;
    case 'setting':
      return <IconSetting key="3" {...rest} />;
    case 'filter':
      return <IconFilter key="4" {...rest} />;
    case 'user':
      return <IconUser key="5" {...rest} />;
    case 'list':
      return <IconList key="6" {...rest} />;
    case 'check':
      return <IconCheck key="7" {...rest} />;
    case 'go-to-link':
      return <IconGoToLink key="8" {...rest} />;
    case 'empty':
      return <IconEmpty key="9" {...rest} />;
  }

  return null;
};

IconFont = React.memo ? React.memo(IconFont) : IconFont;

export default IconFont;
