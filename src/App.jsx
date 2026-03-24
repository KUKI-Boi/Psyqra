import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Battle from './pages/Battle';
import Reflex from './pages/Reflex';
import Audio from './pages/Audio';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/battle" element={<Battle />} />
      <Route path="/reflex" element={<Reflex />} />
      <Route path="/audio" element={<Audio />} />
    </Routes>
  );
}

export default App;
