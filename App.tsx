import React from 'react';
import RouterRoot from 'react-native-auto-route';
import { AppProvider } from './App.provider';
import { ConfigSWR } from './App.ConfigSWR';

const App = () => {
  return <ConfigSWR>
    <AppProvider>
      <RouterRoot />
    </AppProvider>
  </ConfigSWR>;
};

export default App;