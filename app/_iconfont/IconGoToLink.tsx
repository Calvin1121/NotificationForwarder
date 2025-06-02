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

let IconGoToLink: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M553.6 790.4l-44.8-44.8 233.6-233.6-233.6-233.6 44.8-44.8L832 512z"
        fill={getIconColor(color, 0, '#181818')}
      />
      <Path
        d="M192 480h576v64H192z"
        fill={getIconColor(color, 1, '#181818')}
      />
    </Svg>
  );
};

IconGoToLink.defaultProps = {
  size: 30,
};

IconGoToLink = React.memo ? React.memo(IconGoToLink) : IconGoToLink;

export default IconGoToLink;
