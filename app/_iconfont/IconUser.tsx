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

let IconUser: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 448c-35.296 0-64-28.704-64-64s28.704-64 64-64 64 28.704 64 64-28.704 64-64 64m0-192c-70.592 0-128 57.408-128 128s57.408 128 128 128 128-57.408 128-128-57.408-128-128-128"
        fill={getIconColor(color, 0, '#181818')}
      />
      <Path
        d="M768 797.632v-69.92a151.904 151.904 0 0 0-151.712-151.68h-208.576A151.904 151.904 0 0 0 256 727.68v69.92C177.632 727.36 128 625.6 128 512 128 299.904 299.936 128 512 128s384 171.904 384 384c0 113.6-49.632 215.36-128 285.632m-448 46.56v-116.48a87.776 87.776 0 0 1 87.712-87.68h208.576A87.776 87.776 0 0 1 704 727.68v116.48a381.568 381.568 0 0 1-384 0m192-780.16C264.96 64 64 264.96 64 512c0 246.976 200.96 448 448 448s448-201.024 448-448c0-247.04-200.96-448-448-448"
        fill={getIconColor(color, 1, '#181818')}
      />
    </Svg>
  );
};

IconUser.defaultProps = {
  size: 30,
};

IconUser = React.memo ? React.memo(IconUser) : IconUser;

export default IconUser;
