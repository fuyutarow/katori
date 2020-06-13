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

const createSound = (func: any, duration: any) => {
  const sampleRate = audioContext.sampleRate; // サンプリングレート
  const dt = 1 / sampleRate; // 時間刻み
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0); // バッファ配列の生成
  for (let i = 0; i < data.length; i++) {
    data[i] = func(dt * i);
  }
  return buffer;
};

const source = audioContext.createBufferSource();

const playSound = (buffer: any) => {
  source.buffer = buffer;

  // Destination
  source.connect(audioContext.destination);

  // Sourceの再生
  source.start(0);
};

const analyser = audioContext.createAnalyser();

const carrier = audioContext.createOscillator();
carrier.type = 'sine';
carrier.frequency.value = 220;

const Counter: React.FC = () => {
  const [firstTap, setFirstTap] = useState(true);
  const [audio, setAudio] = useState<OscillatorNode>(carrier);

  const offAudio = () => {
    carrier.disconnect();
  };

  const playLow = () => {
    const freqs = [
      462, 466, // ネッタイシマカ, ヒトスジシマカ
      640, 963, // ヒトスジシマカ
    ];

    const currentTime = audioContext.currentTime;
    freqs.forEach(freq => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      oscillator.start(currentTime);
      oscillator.connect(audioContext.destination);
    });

  };

  const playHigh = () => {
    carrier.frequency.value = Freq.High;
    if (firstTap) {
      audio.start(0);
      audio.disconnect();
      setAudio(audio);
      setFirstTap(false);
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
