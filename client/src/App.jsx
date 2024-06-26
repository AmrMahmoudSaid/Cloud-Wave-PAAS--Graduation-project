import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LoginForm from "./components/LoginForm";
import HomePage from "./pages/HomePage";
import Payment from "./pages/Payment";
import PaymentForm from "./pages/Payment";
import AddDatabase from "./pages/AddDatabase";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/loginForm" element={<LoginForm />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/paymentform" element={<PaymentForm />} />
        <Route path="/createdatabase" element={<AddDatabase />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
