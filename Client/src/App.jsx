import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './screens/LoginForm';
import SignUpForm from './screens/SignUpForm';

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
