import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import SignOut from "../components/SignOut";

import Cont from "./Cont";

export default function Help() {
  const navigate = useNavigate();
  return (
    <div className="flex w-screen h-screen text-white bg-[#041b4d]">
      <div className="flex flex-col w-[220px] border-r border-gray-800">
        <Cont />
      </div>
      <div className="flex flex-col min-h-screen flex-grow bg-white text-black">
        <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-gray-500">
          <h1 className="text-2xl font-bold text-[#041b4d] opacity-90">
            HomePage
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
            <div className="absolute w-[200px] border rounded border-solid border-black z-10  top-[55px] flex-col right-[2px]  items-start hidden pb-1 bg-white shadow-lg group-focus:flex">
              <div
                onClick={() => navigate("/profile")}
                className="w-full font-semibold px-4 py-2 text-left hover:bg-gray-200"
              >
                Profile
              </div>
              <SignOut />
            </div>
          </button>
        </div>
        <div className="flex-grow p-6  overflow-auto bg-white px-20">
          <div className="flex flex-col ">
            <p className="font-bold text-3xl px-2 py-10 text-[#041b4d] opacity-90">
              Help
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
