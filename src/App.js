import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux';
import CheckWeather from './components/checkweather/index';
import LocationDetails from './components/detail/index';

import './scss/style.scss';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<CheckWeather />} />
          <Route path="/details/:cityName" element={<LocationDetails />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App;