import React, { useState, useEffect } from 'react';

import {
  Container,
  Button,
} from '@material-ui/core';

import {
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';

import './App.css';
import { findAllInRenderedTree } from 'react-dom/test-utils';

// NOTE: for safari
// @ts-ignore
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const carrier = audioContext.createOscillator();
carrier.type = 'sine';
carrier.frequency.value = 220;

const carrierGain = audioContext.createGain();
carrierGain.gain.value = .6;

carrier.connect(carrierGain);
carrierGain.connect(audioContext.destination);

const Counter = () => {

  const [firstTap, setFirstTap] = useState(true);
  const [audio, setAudio] = useState<OscillatorNode>(carrier);

  const onAudio = () => {
    if (firstTap) {
      audio.start(0);
      audio.disconnect();
      setAudio(audio);
      setFirstTap(false);
    }
    audio.connect(audioContext.destination);
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

const TwitterShare = () => (
  <TwitterShareButton
    url={'https://katori.vercel.app'}
    // title='蚊取り音泉'
    hashtags={['蚊取り音泉']}
  >
    <TwitterIcon size={32} round={true} />
  </TwitterShareButton>

);

const App = () => {

  return (
    <div className="App">
      <div className="App-inner">
        <Container component="main" maxWidth="xs">
          <TwitterShare />
        </Container>
        <img src="/icons/512x512.png" className="App-logo" alt="logo" />
        <Counter />
      </div>
      <a href="https://note.com/fmfmkun/n/n56b5f942800d" target="_blank">
        <img src="/burner.gif" className="burner" />
      </a>
    </div>
  );
};

export default App;
