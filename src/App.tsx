import React, { useState, useEffect } from 'react';
import './App.css';

import {
  Container,
  Button,
} from '@material-ui/core';

const Counter = () => {
  const audioContext = new AudioContext();
  const carrier = audioContext.createOscillator();
  carrier.type = 'sine';
  carrier.frequency.value = 220;

  const modulator = audioContext.createOscillator();
  modulator.frequency.value = 1.0;

  const modulatorGain = audioContext.createGain();
  modulatorGain.gain.value = 50;

  const carrierGain = audioContext.createGain();
  carrierGain.gain.value = .6;

  modulator.connect(modulatorGain);
  modulatorGain.connect(carrier.detune);
  carrier.connect(carrierGain);
  carrierGain.connect(audioContext.destination);

  carrier.start(0);
  carrier.disconnect();
  modulator.start(0);

  const onAudio = () => {
    carrier.connect(audioContext.destination);
  };

  const offAudio = () => {
    carrier.disconnect();
  };

  const setHigh = () => {
    carrier.frequency.value = 15000;
  };

  const setLow = () => {
    carrier.frequency.value = 220;
  };

  return (
    <div>
      <Button
        variant="outlined"
        disableElevation
        onClick={() => {
          onAudio();
          setLow();
        }}
      >
          蚊誘引
      </Button>
      <Button
        variant="outlined"
        disableElevation
        onClick={() => {
          onAudio();
          setHigh();
        }}
      >
          蚊忌避
      </Button>
      <Button
        variant="outlined"
        disableElevation
        onClick={() => {
          offAudio();
        }}
      >
          音停止
      </Button>
    </div>
  );
};

const App = () => {

  return (
    <div className="App">
      {/* <Container component="main" maxWidth="xs"> */}
      <img src="/icons/512x512.png" className="App-logo" alt="logo" />
      <Counter />
    </div>
  );
};

export default App;
