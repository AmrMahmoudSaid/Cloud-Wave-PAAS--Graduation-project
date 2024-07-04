import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import GithubButton from "react-github-login-button";

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const namepatern = /^[A-Za-z\d]{3,}$/;
  const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  const passwordPattern = /^[A-Za-z\d]{8,}$/;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);

      if (email && password) {
        navigate("/payment");
      } else {
        navigate("/signup");
      }
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  const handleGitHubSignup = (e) => {
    e.preventDefault();
    localStorage.setItem("SignType", 2);

    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=Ov23liAiGPUlEm4xMIgH&scope=user`
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-500">
      <form
        onSubmit={handleSubmit}
        className="lg:w-[450px] lg:h-[650px] md:w-[320px] md:h-[500px] bg-white rounded-2xl text-black border border-black border-solid justify-center text-left items-center px-16 py-6 absolute lg:right-[10%] lg:top-[5%] md:right-[5%] md:top-[13%]"
      >
        <div className="flex items-center gap-2 lg:mb-6 md:mb-2">
          <div className="lg:w-24 lg:h-auto md:w-[80px] md:h-auto">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="md:text-base lg:text-2xl font-semibold lg:mb-4">
          Welcome to Cloud Wave
        </div>
        <div className="md:text-xs lg:text-sm opacity-70 mb-4 leading-none">
          Please sign-in to your account and start the adventure
        </div>
        <label className="block mb-2 md:text-sm">Username</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your username"
          className={`w-full lg:px-4 lg:py-2 md:px-2 md:py-0 mb-4 md:mb-2 border ${
            !name || namepatern.test(name)
              ? "border-gray-300"
              : "border-red-500"
          } rounded`}
        />
        {!name || namepatern.test(name) ? null : (
          <ul>
            <li>
              <p className="text-red-500">name at least 3 characters</p>
            </li>
          </ul>
        )}
        <label className="block mb-2 md:text-sm">Email</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={`w-full lg:px-4 lg:py-2 md:px-2 md:py-0 mb-4 md:mb-2 border ${
            !email || pattern.test(email) ? "border-gray-300" : "border-red-500"
          } rounded`}
        />
        {!email || pattern.test(email) ? null : (
          <ul>
            <li>
              <p className="text-red-500">Enter a valid email</p>
            </li>
          </ul>
        )}

        <label className="block mb-2 md:text-sm">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className={`w-full lg:px-4 lg:py-2 md:px-2 md:py-0 mb-4 md:mb-2 border ${
            !password || passwordPattern.test(password)
              ? "border-gray-300"
              : "border-red-500"
          } rounded`}
        />
        {!password || passwordPattern.test(password) ? null : (
          <ul>
            <li>
              <p className="text-red-500">password at least 8 characters</p>
            </li>
          </ul>
        )}

        <input
          type="submit"
          value="Signup"
          disabled={
            !email ||
            !password ||
            !pattern.test(email) ||
            !passwordPattern.test(password)
          }
          className={`w-full lg:px-4 lg:py-2 md:px-2 md:py-1 mb-4 ${
            !email ||
            !password ||
            !pattern.test(email) ||
            !passwordPattern.test(password)
              ? "bg-blue-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white rounded cursor-pointer ease-in-out duration-500`}
        />

        <div className="mb-4">
          Not your first time?
          <Link to="/login" className="text-blue-500">
            Sign into your account
          </Link>
        </div>
        <div className="mb-4 flex justify-center items-center relative">
          <span className="absolute bg-white px-2">or</span>
          <div className="w-full h-px bg-gray-300"></div>
        </div>
        <div className=" font-bold ml-[40px]">
          <GithubButton type="dark" onClick={handleGitHubSignup} />
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
