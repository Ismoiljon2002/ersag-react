import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Orders from './pages/Orders';
import Summary from './pages/Summary';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Orders />} />
        <Route path='/summary' element={<Summary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
