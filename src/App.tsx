import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Button,
  ThemeProvider,
  Typography,
  createMuiTheme,
} from '@material-ui/core';
import {
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';

import { css } from 'emotion';

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

  const theme = createMuiTheme({
    typography: {
      subtitle1: {
        fontSize: 16,
      },
      body1: {
        fontWeight: 600,
      },
      button: {
        fontStyle: 'italic',
      },
    },
  });

  return (
    <>
      <div>
        <Button
          disableElevation
          onClick={() => {
            playLow();
            setPlaying(Playing.Low);
            ga.logEvent('switchPlaying', { status: 'low' });
          }}
          variant={playing === Playing.Low ? 'contained' : 'outlined'}
          disabled={playing === Playing.Low}
          style={{ border: '2px solid' }}
        >
          <ThemeProvider theme={theme} >
            <Typography>蚊誘引</Typography>
          </ThemeProvider>
        </Button>
        <Button
          disableElevation
          onClick={() => {
            playHigh();
            setPlaying(Playing.High);
            ga.logEvent('switchPlaying', { status: 'high' });
          }}
          variant={playing === Playing.High ? 'contained' : 'outlined'}
          disabled={playing === Playing.High}
          style={{ border: '2px solid' }}
        >
          <ThemeProvider theme={theme} >
            <Typography>蚊忌避</Typography>
          </ThemeProvider>
        </Button>
        <Button
          disableElevation
          onClick={() => {
            pauseLow();
            pauseHigh();
            setPlaying(Playing.None);
            ga.logEvent('switchPlaying', { status: 'none' });
          }}
          variant="outlined"
          style={{ border: '2px solid' }}
        >
          <ThemeProvider theme={theme} >
            <Typography>音停止</Typography>
          </ThemeProvider>
        </Button>
      </div>
      <div
        className={css`
        margin: '100px',
      `}>
        <Box m={2} pt={3}>
          <ThemeProvider theme={theme} >
            <Typography>
              {
                (playing === Playing.High) ? '蚊やネズミが嫌う高周波の音波を発生させ虫除けします'
                  : (playing === Playing.Low) ? '	羽音に固有の周波数を発生させることで蚊をおびき寄せて殺します'
                    : '蚊を殺すためのアプリです'
              }
            </Typography>
          </ThemeProvider>
        </ Box>
      </div>
    </>
  );
};

const TwitterShare = () => (
  <TwitterShareButton
    url={'https://katori.vercel.app'}
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
