/* eslint-disable */
import React, { Component } from 'react';
import CameraScreen from './src/Screens/CameraScreen';
import { NativeBaseProvider } from 'native-base';

export default class App extends Component {
  render() {
    return (
      <NativeBaseProvider>
        <CameraScreen />
      </NativeBaseProvider>
    )

  }
}
