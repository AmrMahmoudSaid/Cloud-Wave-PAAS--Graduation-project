import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LoginForm from "./components/LoginForm";
import HomePage from "./pages/HomePage";
import Payment from "./pages/Payment";
import PaymentForm from "./pages/Payment";
import AddDatabase from "./pages/AddDatabase";
import AddApplication from "./pages/AddApplication";
import AppLogs from "./pages/AppLogs";
import { Helmet } from "react-helmet";

function App() {
  return (
    <>
      <Helmet>
        <title>Cloud wave</title>
      </Helmet>
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
          <Route path="/createapplication" element={<AddApplication />} />
          <Route path="/applogs" element={<AppLogs />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
