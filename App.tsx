import React from 'react';
import RouterRoot from 'react-native-auto-route';
import { AppProvider } from './App.provider';
import { ConfigSWR } from './App.configSWR';
import { InitPermission } from './App.permission';

const App = () => {
  return <ConfigSWR>
    <AppProvider>
      <InitPermission />
      <RouterRoot />
    </AppProvider>
  </ConfigSWR>
};

export default App;