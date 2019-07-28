// DEPENDENCIES
import React, {FC} from 'react';

// COMPONENTS
import Navbar from './navbar/navbar';
import TruckProfile from './truck-profile/truck-profile'

const App:FC = () => (
  <div className="App">
    <Navbar/>
    <TruckProfile/>
  </div>
);

export default App;
