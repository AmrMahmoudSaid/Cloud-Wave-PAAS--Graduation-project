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
import Callback from "./pages/callback";
import DatabaseLogs from "./pages/DatabaseLogs";
import Billing from "./pages/Billing";
import UserProfile from "./pages/UserProfile";
import ContactUs from "./pages/contactUs";
import AboutUs from "./pages/aboutus";
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
          <Route path="/login/callback" element={<Callback />} />
          <Route path="/databaselogs" element={<DatabaseLogs />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          AboutUs
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
