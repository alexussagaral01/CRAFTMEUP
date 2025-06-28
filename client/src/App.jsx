import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './component/Login';
import RegisterForm from './component/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </Router>
  );
}

export default App;
