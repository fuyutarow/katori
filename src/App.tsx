import React, { useState, useEffect } from 'react';
import './App.css';

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
    carrier.disconnect()
  modulator.start(0);

  const onAudio = () => {
    carrier.connect(audioContext.destination)
  }

  const offAudio = () => {
    carrier.disconnect()
  }

  const setHigh = () => {
    carrier.frequency.value = 15000;
  }

  const setLow = () => {
    carrier.frequency.value = 220;
  }

  return (
    <div>
      <div>

        <button onClick={onAudio} >on</button>
        <button onClick={offAudio}>off</button>
      </div>
      <div>
        <button onClick={setHigh} >high</button>
        <button onClick={setLow} >low</button>

      </div>
    </div>
  );
}


const App = () => {


  return (
    <div className="App">
      <Counter />
    </div>
  );
}

export default App;
