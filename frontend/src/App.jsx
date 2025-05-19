import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import './App.css';
import { Root } from './components/Root/Root';
import Reviews from './pages/Reviews/Reviews';
import Users from './pages/Users/Users';

function App() {
  return (
    <AuthProvider>
      <Root>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="users" element={<Users />} />
          <Route path="about" element={<About />} />
        </Routes>
      </Root>
    </AuthProvider>
  );
}

export default App;
