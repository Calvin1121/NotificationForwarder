import React from 'react';
import RouterRoot from 'react-native-auto-route';
import { AppProvider } from './App.provider';
import { ConfigSWR } from './App.configSWR';
import { InitialApp } from './App.initial';

const App = () => {
  return <ConfigSWR>
    <AppProvider>
      <InitialApp />
      <RouterRoot />
    </AppProvider>
  </ConfigSWR>
};

export default App;