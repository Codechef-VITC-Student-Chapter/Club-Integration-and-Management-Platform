import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/signup" element={<SignUpForm />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
