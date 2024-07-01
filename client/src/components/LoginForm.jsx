import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import axios from "axios";

function LoginForm() {
  const [email, setEmail] = useState("omar@example.com");
  const [password, setPassword] = useState("qwerty");
  const navigate = useNavigate();
  useEffect(() => {
    // Check if token exists in local storage
    // const token = localStorage.getItem("token");
    // if (token) {
    //   // Redirect to instructor homepage if token exists
    //   navigate("/login");
    // }
  }, [navigate]);
  const url = "https://cloud.dev/api/users/signin";
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(url, {
        email: email,
        password: password,
      });
      console.log(response.data);
      localStorage.setItem("userId", response.data.id);

      if (localStorage.getItem("userId")) {
        navigate("/homepage");
      } else {
        navigate("/login");
      }
      console.log(response.data.data);
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-500">
      <form
        onSubmit={handleSubmit}
        className="lg:w-[450px] lg:h-[650px] md:w-[320px] md:h-[500px] bg-white rounded-2xl text-black border border-black border-solid justify-center text-left items-center px-16 py-6 absolute lg:right-[10%] lg:top-[5%] md:right-[5%] md:top-[13%] "
      >
        <div className="flex items-center gap-2 lg:mb-6 md:mb-2">
          <div className="lg:w-24 lg:h-auto md:w-[80px] md:h-auto">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="md:text-base lg:text-2xl font-semibold lg:mb-4 ">
          Welcome to Cloud Wave
        </div>
        <div className="md:text-xs lg:text-sm opacity-70 mb-4 leading-none">
          Please sign-in to your account and start the adventure
        </div>

        <label className="block mb-2 md:text-sm">Email</label>
        <input
          type="text"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Enter your email"
          className="w-full lg:px-4 lg:py-2 md:px-2 md:py-0 mb-4 md:mb-2 border border-gray-300 rounded"
        />
        <label className="block mb-2 md:text-sm">Password</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Enter your password"
          className="w-full lg:px-4 lg:py-2 md:px-2 md:py-0 mb-4 md:mb-2 border border-gray-300 rounded"
        />
        <input
          type="submit"
          value="Sign in"
          className="w-full lg:px-4 lg:py-2 md:px-2 md:py-1 mb-4 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-700 ease-in-out	duration-500"
        />
        <div className="mb-4">
          New to our platform?
          <Link to="/signup" className="text-blue-500">
            Create an account
          </Link>
        </div>
        <div className="mb-4 flex justify-center items-center relative">
          <span className="absolute bg-white px-2">or</span>
          <div className="w-full h-px bg-gray-300"></div>
        </div>
        <div>
          <Link to="/github-login" className="text-blue-500">
            Github Signin
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
