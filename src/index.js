import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { sessionService } from 'redux-react-session';
import App from './components/App';
import store from './store.js';



// Init the session service
sessionService.initSessionService(store);

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root')
);
