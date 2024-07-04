import { ClipLoader } from "react-spinners";
import { useState, useEffect } from "react";
import axios from "axios";

const Callback = () => {
  const [timeLeft, setTimeLeft] = useState(4);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      window.location.href = '/login';
    }
  }, [timeLeft]);

  useEffect(() => {
    const getAccessToken = async (code) => {
      localStorage.setItem("code", code);
    };

    const creat = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const signType = localStorage.getItem("SignType");
      console.log(code);
      const url = "https://cloud.dev/api/users/login-git";
      if (signType === '1') {
        console.log("login");
        const response = await axios.post(url, {
          code: code,
        });
        localStorage.removeItem("code");
        if (response.status === 200) {
          window.location.href = "/homepage";
        } else {
          alert("something went wrong");
          window.location.href = "/login";
        }
      } else {
        console.log("payment");
        window.location.href = "/payment";
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      getAccessToken(code);
      creat();
    }
  }, []);

  return (
      <div>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap');
      `}</style>
        <style>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .loading-header {
          font-family: "Merriweather", serif;
          font-size: 36px;
          margin-bottom: 20px;
        }
      `}</style>

        <div className="loading-container">
          <div className="loading-header">Signing</div>
          <ClipLoader color={"#123abc"} size={150} />
        </div>
      </div>
  );
};

export default Callback;
