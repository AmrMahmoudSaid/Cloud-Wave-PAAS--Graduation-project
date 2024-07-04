import { useEffect, useRef, useState } from "react";
import Cont from "./Cont";
import Footer from "../components/Footer";
import axios from "axios";

function AppLogs() {
  const logsElem = useRef(null);
  const tokenId = localStorage.getItem("appId");
  const [apps, setApps] = useState(null); // Initialize as null or an empty object

  const fetchAppInfo = async () => {
    try {
      const response = await axios.get(
          `https://cloud.dev/api/applications/management/${tokenId}`
      );
      console.log("Application found:", response.data);
      setApps(response.data);
    } catch (error) {
      console.error("Failed to fetch Applications:", error);
    }
  };

  useEffect(() => {
    if (!tokenId) return; // Ensure tokenId exists before making requests

    const connectToLogs = () => {
      const url = `https://cloud.dev/api/applications/management/logs/${tokenId}`; // Replace with your actual endpoint

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

    fetchAppInfo();
    connectToLogs();
  }, [tokenId]);

  return (
      <div className="flex w-screen h-screen text-white bg-[#041b4d]">
        <Cont />
        <div className="flex flex-col flex-grow bg-white text-black">
          <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-gray-500">
            <h1 className="text-2xl font-bold">Web Service</h1>
            <button className="relative text-sm focus:outline-none group">
              <div className="flex items-center justify-between w-32 h-10 px-4 border rounded hover:bg-[#041b4d] hover:text-white">
                <span className="font-medium">Dropdown</span>
                <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                  <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="absolute z-10 flex-col items-start hidden w-full pb-1 bg-[#041b4d] shadow-lg group-focus:flex">
                <a
                    className="w-full px-4 py-2 text-left hover:bg-gray-900"
                    href="#"
                >
                  Menu Item 1
                </a>
                <a
                    className="w-full px-4 py-2 text-left hover:bg-gray-900"
                    href="#"
                >
                  Menu Item 2
                </a>
                <a
                    className="w-full px-4 py-2 text-left hover:bg-gray-900"
                    href="#"
                >
                  Menu Item 3
                </a>
              </div>
            </button>
          </div>
          <div className="flex-grow p-6 overflow-auto bg-white">
            <div className="flex flex-col">
              {apps && ( // Check if apps is not null before rendering
                  <>
                    <div>
                      <p className="font-semibold text-3xl px-2 mt-2 text-[#041b4d] opacity-90">
                        {apps.applicationName}
                      </p>
                      <p className="font-thick text-sm px-4 opacity-75">
                        {apps.host}
                      </p>
                    </div>
                    <div className="flex flex-col w-11/12 m-auto font-bold px-2">
                      <div className="flex flex-row justify-between items-center border-b py-2 border-solid border-black">
                        <div className="w-1/3">Status</div>
                        <div className="w-1/4">Host</div>
                        <div className="w-1/4">Plan</div>
                        <div className="w-1/4">Last deployment</div>
                        <div className="w-1/4"></div>
                      </div>
                      <div className="flex flex-row justify-between items-center font-semibold py-2">
                        <div className="w-1/3">{apps.status}</div>
                        <div className="w-1/4">{apps.host}</div>
                        <div className="w-1/4">{apps.plan}</div>
                        <div className="w-1/4">{apps.lastDeployment}</div>
                        <div className="w-1/4"></div>
                      </div>
                    </div>
                  </>
              )}
              <div className="bg-black w-11/12 m-auto text-gray-300 text-md font-semibold py-3 px-5 border rounded scroll-smooth h-[70vh] overflow-auto mt-10">
                <div className="flex flex-row items-center text-center justify-start py-2 gap-5 border-b border-solid border-gray-300">
                  <div className="cursor-pointer border-r-2 py-2 border-solid border-white w-1/6">
                    Logs
                  </div>
                </div>
                <pre id="logs" ref={logsElem}></pre>
              </div>
              <div className="bg-black w-11/12 m-auto text-gray-300 text-md font-semibold py-3 px-5 border rounded scroll-smooth h-[70vh] overflow-auto mt-10">
                <div className="flex flex-row items-center text-center justify-start py-2 gap-5 border-b border-solid border-gray-300">
                  <div className="cursor-pointer hover:bg-gray-300 border-r-2 py-2 border-solid border-white hover:text-black w-1/6">
                    Logs
                  </div>
                  <div className="cursor-pointer hover:bg-gray-300 py-2 hover:text-black w-1/6">
                    Terminal
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

export default AppLogs;
