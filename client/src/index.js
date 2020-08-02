import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { SWRConfig } from 'swr'
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:5000'

const fetcher = (...args) => axios(...args).then((res) => res.data)

ReactDOM.render(
    <Provider store={store}>
        <SWRConfig value={{ dedupingInterval: 1000, refreshWhenHidden: true, fetcher }}>
            <App />
        </SWRConfig>
    </Provider>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
