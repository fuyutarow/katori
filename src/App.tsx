import React, { useState, useEffect, useRef } from 'react';

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

const Freq = {
  High: 15000,
};

// NOTE: for safari
// @ts-ignore
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const carrier = audioContext.createOscillator();
carrier.type = 'sine';
carrier.frequency.value = 220;

const freqs = [
  462, 466, // ネッタイシマカ, ヒトスジシマカ
  640, 963, // ヒトスジシマカ
];

const oscillators: Array<OscillatorNode> = freqs.map(freq => {
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = freq;
  return oscillator;
});

const Counter: React.FC = () => {
  const [firstTapLow, setFirstTapLow] = useState(true);
  const [firstTapHigh, setFirstTapHigh] = useState(true);
  const [audio, setAudio] = useState<OscillatorNode>(carrier);

  const offAudio = () => {
    carrier.disconnect();
    oscillators.forEach(oscillator => {
      oscillator.disconnect();
    });
  };

  const playLow = () => {
    const currentTime = audioContext.currentTime;
    if (firstTapLow) {
      oscillators.forEach(oscillator => {
        oscillator.start(currentTime);
      });
      setFirstTapLow(false);
    }
    oscillators.forEach(oscillator => {
      // oscillator.start(currentTime);
      oscillator.connect(audioContext.destination);
    });
  };

  const playHigh = () => {
    carrier.frequency.value = Freq.High;
    if (firstTapHigh) {
      audio.start(0);
      audio.disconnect();
      setAudio(audio);
      setFirstTapHigh(false);
    }
    audio.connect(audioContext.destination);
  };

  return (
    <div>
      <Button
        variant="outlined"
        disableElevation
        onClick={() => {
          playLow();
        }}
      >
        蚊誘引
      </Button>
      <Button
        variant="outlined"
        disableElevation
        onClick={() => {
          playHigh();
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
