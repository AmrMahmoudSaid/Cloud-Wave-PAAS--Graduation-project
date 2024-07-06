import { useEffect, useRef, useState } from "react";
import Cont from "./Cont";
import Footer from "../components/Footer";
import axios from "axios";

import SignOut from "../components/SignOut";
import { useNavigate } from "react-router-dom";

function DatabaseLogs() {
  const logsElem = useRef(null);
  const tokenId = localStorage.getItem("databaseId");
  const [data, setData] = useState(null); // Initialize as null or an empty object
  const navigate = useNavigate();
  const fetchDatabaseInfo = async () => {
    console.log(tokenId);
    if (!tokenId) return;
    try {
      const response = await axios.get(
        `https://cloud.dev/api/database/management/${tokenId}`
      );
      console.log("Application found:", response.data);
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch Applications:", error);
    }
  };

  useEffect(() => {
    if (!tokenId) return;

    const connectToLogs = () => {
      const url = `https://cloud.dev/api/database/management/logs/${tokenId}`; // Replace with your actual endpoint

      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        const logLine = event.data.trim();
        if (logsElem.current) {
          logsElem.current.innerHTML += logLine + "\n";
          logsElem.current.scrollTop = logsElem.current.scrollHeight; // Scroll to bottom
        }
      };

      eventSource.onerror = (err) => {
        console.error("EventSource error:", err);
        eventSource.close();
        if (logsElem.current) {
          logsElem.current.innerHTML += "Error fetching logs.\n";
        }
      };
    };

    fetchDatabaseInfo();
    connectToLogs();
  }, [tokenId]);

  return (
    <div className="flex w-screen h-screen text-white bg-[#041b4d]">
      <div className="flex flex-col w-[220px] border-r border-gray-800">
        <Cont />
      </div>
      <div className="flex flex-col flex-grow bg-white text-black">
        <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-gray-500">
          <h1 className="text-2xl font-bold text-[#041b4d] opacity-90">
            Database Service
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
        <div className="flex-grow p-6 overflow-auto bg-white">
          <div className="flex flex-col">
            {data && ( // Check if data is not null before rendering
              <>
                <div>
                  <p className="font-semibold text-3xl px-2 mt-2 text-[#041b4d] opacity-90">
                    {data.serviceName}
                  </p>
                  <p className="font-thick text-sm px-4 opacity-75">
                    cloudwave.apps
                  </p>
                </div>

                <div className="flex flex-col w-11/12 m-auto font-bold px-2">
                  <div className="flex flex-row justify-between items-center border-b py-2 border-solid border-black">
                    <div className="w-1/3">Status</div>
                    <div className="w-1/4">Port</div>
                    <div className="w-1/4">Database User</div>
                    <div className="w-1/4">User Password</div>
                    <div className="w-1/4">Root Password</div>
                    <div className="w-1/4">Last Deployment</div>
                    <div className="w-1/4"></div>
                  </div>
                  <div className="flex flex-row justify-between items-center font-semibold py-2">
                    <div className="w-1/3">{data.status}</div>
                    <div className="w-1/4">{data.nodePort}</div>
                    <div className="w-1/4">{data.databaseUsername}</div>
                    <div className="w-1/4">{data.databaseUsernamePass}</div>
                    <div className="w-1/4">{data.rootPassword}</div>
                    <div className="w-1/4">{data.lastDeployment}</div>
                    <div className="w-1/4"></div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-black w-[800px] m-auto text-gray-300 text-md font-semibold py-3 px-5 border rounded scroll-smooth scroll-auto h-[70vh] overflow-auto mt-10">
              <div className="flex flex-row items-center text-center justify-start py-2 gap-5 border-b border-solid border-gray-300">
                <div className="cursor-pointer border-r-2 py-2 border-solid border-white w-1/6">
                  Logs
                </div>
              </div>
              <pre id="logs" ref={logsElem}></pre>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default DatabaseLogs;
