import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ga } from 'plugins/firebase';
import { version } from '../package.json';
import { isPWA } from 'utils';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

ga.logEvent('app_view', {
  app_name: isPWA() ? 'pwa' : 'web',
  app_version: version,
});

serviceWorker.register({
  onUpdate: (registration) => {
    console.log('New version available! Ready to update?');
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  },
});
