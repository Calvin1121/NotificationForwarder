/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { Svg, GProps, Path } from 'react-native-svg';
import { getIconColor } from './helper';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

let IconGoBack: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M470.4 233.6l44.79999999 44.8-233.6 233.6 233.6 233.6-44.79999999 44.8L192 512z"
        fill={getIconColor(color, 0, '#181818')}
      />
      <Path
        d="M832 544l-576 0 0-64L832 480z"
        fill={getIconColor(color, 1, '#181818')}
      />
    </Svg>
  );
};

IconGoBack.defaultProps = {
  size: 30,
};

IconGoBack = React.memo ? React.memo(IconGoBack) : IconGoBack;

export default IconGoBack;
