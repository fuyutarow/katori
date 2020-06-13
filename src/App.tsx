import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Button,
} from '@material-ui/core';
import {
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';

import { ga } from 'plugins/firebase';
import './App.css';

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

enum Playing {
  High,
  Low,
  None,
}

const Counter: React.FC = () => {
  const [firstTapLow, setFirstTapLow] = useState(true);
  const [firstTapHigh, setFirstTapHigh] = useState(true);
  const [playing, setPlaying] = useState(Playing.None);
  const [audio, setAudio] = useState<OscillatorNode>(carrier);

  const playLow = () => {
    pauseHigh();
    const currentTime = audioContext.currentTime;
    if (firstTapLow) {
      oscillators.forEach(oscillator => {
        oscillator.start(currentTime);
      });
      setFirstTapLow(false);
    }
    oscillators.forEach(oscillator => {
      oscillator.connect(audioContext.destination);
    });
  };

  const pauseLow = () => {
    oscillators.forEach(oscillator => {
      oscillator.disconnect();
    });
  };

  const playHigh = () => {
    pauseLow();
    carrier.frequency.value = Freq.High;
    if (firstTapHigh) {
      audio.start(0);
      audio.disconnect();
      setAudio(audio);
      setFirstTapHigh(false);
    }
    audio.connect(audioContext.destination);
  };

  const pauseHigh = () => {
    carrier.disconnect();
  };

  return (
    <div>
      <Button
        disableElevation
        onClick={() => {
          playLow();
          setPlaying(Playing.Low);
        }}
        variant={playing === Playing.Low ? 'contained' : 'outlined'}
        disabled={playing === Playing.Low}
      >
        蚊誘引
      </Button>
      <Button
        disableElevation
        onClick={() => {
          playHigh();
          setPlaying(Playing.High);
        }}
        variant={playing === Playing.High ? 'contained' : 'outlined'}
        disabled={playing === Playing.High}
      >
        蚊忌避
      </Button>
      <Button
        disableElevation
        onClick={() => {
          pauseLow();
          pauseHigh();
          setPlaying(Playing.None);
        }}
        variant="outlined"
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
      <a href="https://note.com/fmfmkun/n/n56b5f942800d" target="_blank" onClick={e => {
        ga.logEvent('click_burner');
      }}>
        <img src="/burner.gif" className="burner" />
      </a>
    </div>
  );
};

export default App;
