import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import Cont from "./Cont";
import Footer from "../components/Footer";
import SignOut from "../components/SignOut";
import Profile from "../components/Profile";
import 'xterm/css/xterm.css'; // Ensure xterm CSS is imported

function AppLogs() {
  const logsElem = useRef(null);
  const terminalRef = useRef(null);
  const fitAddon = new FitAddon();
  const terminalInstance = useRef(null);
  const websocketRef = useRef(null); // Reference to store WebSocket instance

  const tokenId = localStorage.getItem("appId");
  const [apps, setApps] = useState(null);
  const [showLogs, setShowLogs] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [command, setCommand] = useState(''); // State for the command input

  const handleTerminal = () => {
    setShowLogs(false);
    setShowTerminal(true);
  };

  const handleLogs = () => {
    setShowLogs(true);
    setShowTerminal(false);
  };

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
    if (!terminalRef.current) return;

    const terminal = new Terminal();
    terminalInstance.current = terminal; // Store terminal instance in a ref
    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);
    fitAddon.fit();

    let ws = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
      ws = new WebSocket(`wss://cloud.dev/api/applications/management/${tokenId}`);
      websocketRef.current = ws; // Store WebSocket instance in a ref

      ws.onopen = () => {
        console.log("WebSocket connection opened");
        reconnectAttempts = 0;

        terminal.onData((data) => {
          console.log("Sending data to server:", data);
          ws.send(data);
        });
      };

      ws.onmessage = (event) => {
        console.log("Received data from server:", event.data);
        terminal.write(event.data);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        if (reconnectAttempts < maxReconnectAttempts) {
          setTimeout(connectWebSocket, 1000 * (2 ** reconnectAttempts)); // Exponential backoff
          reconnectAttempts += 1;
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
          console.log("Attempting to reconnect...");
          if (reconnectAttempts < maxReconnectAttempts) {
            setTimeout(connectWebSocket, 1000 * (2 ** reconnectAttempts)); // Exponential backoff
            reconnectAttempts += 1;
          }
        }
      };
    };

    if (tokenId) {
      connectWebSocket();
    }

    return () => {
      if (ws) {
        ws.close();
      }
      terminal.dispose();
    };
  }, [tokenId]);

  useEffect(() => {
    if (!tokenId) return;

    const connectToLogs = () => {
      const url = `https://cloud.dev/api/applications/management/logs/${tokenId}`;

      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        const logLine = event.data.trim();
        if (logsElem.current) {
          logsElem.current.innerHTML += logLine + "\n";
          logsElem.current.scrollTop = logsElem.current.scrollHeight;
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

  const handleCommandChange = (e) => {
    setCommand(e.target.value);
  };

  const sendCommand = () => {
    if (command.trim() === '') return; // Prevent sending empty commands

    if (terminalInstance.current) {
      terminalInstance.current.write(`\r\n${command}\r\n`); // Display command in terminal
      if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        websocketRef.current.send(command); // Send command via WebSocket
      }
      setCommand(''); // Clear command input
    }
  };

  return (
      <div className="flex w-screen h-screen text-white bg-[#041b4d]">
        <div className="flex flex-col w-[220px] border-r border-gray-800">
          <Cont />
        </div>
        <div className="flex flex-col flex-grow bg-white text-black">
          <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-gray-500">
            <h1 className="text-2xl font-bold">Web Service</h1>
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
                <Profile />
                <SignOut />
              </div>
            </button>
          </div>
          <div className="flex-grow p-6 overflow-auto bg-white">
            <div className="flex flex-col">
              {apps && (
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
              <div className="flex flex-col w-[1000px] ml-24">
                <div className="flex flex-row items-center bg-white w-full text-black text-center justify-start py-2 gap-5 border border-b-0 border-solid border-gray-300">
                  <div
                      onClick={handleLogs}
                      className={`cursor-pointer hover:bg-black-600 border-r-2 py-2 border-solid border-white hover:text-black w-1/6 ${
                          showLogs ? "bg-black-600 text-white" : ""
                      }`}
                  >
                    Logs
                  </div>
                  <div
                      onClick={handleTerminal}
                      className={`cursor-pointer hover:bg-gray-300 py-2 hover:text-black w-1/6 ${
                          showTerminal ? "bg-gray-300" : ""
                      }`}
                  >
                    Terminal
                  </div>
                </div>
                <div className="bg-black w-[1000px] m-auto text-gray-300 text-md font-semibold rounded-t-none border rounded scroll-smooth h-[70vh] overflow-auto">
                  {showLogs && (
                      <pre
                          ref={logsElem}
                          className="p-4 font-normal text-sm overflow-auto h-full bg-black"
                      ></pre>
                  )}
                  {showTerminal && (
                      <div className="h-full w-full bg-black p-2">
                        <div ref={terminalRef} className="h-[90%] w-full"></div>
                        <div className="flex">
                          <input
                              type="text"
                              value={command}
                              onChange={handleCommandChange}
                              className="w-full p-2 text-black"
                              placeholder="Enter command"
                          />
                          <button
                              onClick={sendCommand}
                              className="ml-2 px-4 py-2 bg-blue-500 text-white"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
  );
}

export default AppLogs;
