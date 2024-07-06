import { useEffect, useState } from "react";
import Cont from "./Cont";
import Footer from "../components/Footer";
import SignOut from "../components/SignOut";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "https://cloud.dev/api/user/update",
        formData
      );
      setMessage("User updated successfully");
      console.log("User updated:", response.data);
    } catch (error) {
      setMessage("Failed to update user");
      console.error("Failed to update user:", error);
    }
  };

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const response = await axios.get(
          "https://cloud.dev/api/users/currentuser"
        );
        console.log("Database found:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch Databases:", error);
      }
    };
    fetchInformation();
  }, []);
  return (
    <div className="flex w-screen h-screen text-white bg-[#041b4d]">
      <div className="flex flex-col w-[220px] border-r border-gray-800">
        <Cont />
      </div>
      <div className="flex flex-col min-h-screen flex-grow bg-white text-black">
        <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-gray-500">
          <h1 className="text-2xl font-bold text-[#041b4d] opacity-90">
            Profile
          </h1>
          <button className="relative flex flex-row gap-2 text-center right-24 items-center text-sm focus:outline-none group">
            <div className="text-lg font-semibold text-[#041b4d] opacity-90">
              MY Account
            </div>
            <div className="flex w-8 h-8 rounded-full border bg-[#071952] rounded hover:bg-[#041b4d] hover:text-white">
              <div className="font-medium text-white text-center items-center m-auto">
                CV
              </div>
            </div>
            <div className="absolute w-[200px] border rounded border-solid border-black z-10 top-[55px] flex-col right-[2px] items-start hidden pb-1 bg-white shadow-lg group-focus:flex">
              <SignOut />
            </div>
          </button>
        </div>
        <div className="flex-grow p-6 overflow-auto bg-white px-20">
          <div className="flex flex-col w-[900px] ">
            <p className="font-bold text-4xl px-2 py-10 text-[#041b4d] opacity-90">
              Account Setting
            </p>
            <form
              onSubmit={handleSubmit}
              className="space-y-6 border border-solid border-gray-400  shadow-xl rounded w-1/2 px-4 py-4"
            >
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder={user.name}
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#041b4d] focus:border-[#041b4d] sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder={user.email}
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#041b4d] focus:border-[#041b4d] sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#041b4d] focus:border-[#041b4d] sm:text-sm"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#041b4d] hover:bg-[#071952] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#041b4d]"
                >
                  Update
                </button>
              </div>
            </form>
            {message && (
              <div className="mt-4 text-sm text-gray-600">{message}</div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Profile;
