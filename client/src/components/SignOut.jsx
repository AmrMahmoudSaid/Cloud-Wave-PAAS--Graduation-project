import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignOut() {
  const URL = "https://cloud.dev/api/users/signup";
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(URL, {
        name: name,
      });

      // localStorage.setItem("userId", response.data.data.id);

      // if (localStorage.getItem("userId")) {
      navigate("/login");
      // } else {
      //   navigate("/login");
      // }
      console.log(response.data);
    } catch (error) {
      console.error("Subscription failed", error);
    }
  };
  return (
    <div
      className="w-full font-semibold px-4 py-2 text-left hover:bg-gray-200"
      onClick={handleSubmit}
    >
      Sign Out
    </div>
  );
}

export default SignOut;
