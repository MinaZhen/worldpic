import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import api from 'api'
import logic from './logic'

api.token = sessionStorage.getItem('token')
logic.userId = sessionStorage.getItem('userId')

ReactDOM.render(<HashRouter>
    <App />
</HashRouter>,
    document.getElementById('root'));
registerServiceWorker();