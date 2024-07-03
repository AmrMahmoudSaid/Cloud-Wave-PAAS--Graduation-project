import { useEffect, useState } from "react";
import Cont from "./Cont";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
function HomePage() {
  const [databases, setDatabases] = useState([]);
  const [applications, setApplications] = useState([]);

  const fetchDatabases = async () => {
    try {
      const response = await axios.get(
        "https://cloud.dev/api/database/management/show"
      );
      console.log("Database found:", response.data);
      setDatabases(response.data);
    } catch (error) {
      console.error("Failed to fetch Databases:", error);
    }
  };
  const fetchApplication = async () => {
    try {
      const response = await axios.get(
        "https://cloud.dev/api/applications/management/show"
      );
      console.log("Application found:", response.data);
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch Applications:", error);
    }
  };
  const deleteDatabase = async (id) => {
    try {
      const response = await axios.delete(
        `https://cloud.dev/api/database/management/${id}`
      );
      console.log("Application found:", response.data);
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch Applications:", error);
    }
  };
  const deleteApplication = async (id) => {
    try {
      const response = await axios.delete(
        `https://cloud.dev/api/applications/management/${id}`
      );
      console.log("Application found:", response.data);
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch Applications:", error);
    }
  };
  useEffect(() => {
    fetchDatabases();
    fetchApplication();
    deleteApplication();
    deleteDatabase();
  }, [fetchDatabases,fetchApplication]);

  return (
    <div className="flex w-screen h-screen text-white bg-[#041b4d]">
      <Cont />
      <div className="flex flex-col flex-grow bg-white text-black">
        <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-gray-500">
          <h1 className="text-2xl font-bold">HomePage</h1>
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
        <div className="flex-grow p-6 overflow-auto bg-white px-20">
          <div className="flex flex-col">
            <p className="font-bold text-3xl px-2 py-10">My Databases</p>
            {databases.length > 0 ? (
              <div className="flex flex-col w-11/12 m-auto font-bold px-2">
                <div className="flex flex-row justify-between items-center border-b py-2 border-solid border-black">
                  <div className="w-1/3">Service Name</div>
                  <div className="w-1/4">Status</div>
                  <div className="w-1/4">Plan</div>
                  <div className="w-1/4">Last Deployed</div>
                  <div className="w-1/4"></div>
                </div>
                {databases.map((database, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-between items-center font-semibold py-2"
                  >
                    <div className="w-1/3">{database.deploymentName}</div>
                    <div className="w-1/4">{database.status}</div>
                    <div className="w-1/4">{database.plan}</div>
                    <div className="w-1/4">{database.lastDeployment}</div>
                    <div className="w-1/4">
                      <button
                        className="text-red-600 pointer"
                        onClick={() => deleteDatabase(database.id)}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center">There are no databases.</p>
            )}
            <p className="font-bold text-3xl px-2 mt-10 py-10">
              MY Applications
            </p>
            {applications.length > 0 ? (
              <div className="flex flex-col w-11/12 m-auto font-bold px-2">
                <div className="flex flex-row justify-between items-center border-b py-2 border-solid border-black">
                  <div className="w-1/3">Service Name</div>
                  <div className="w-1/4">Status</div>
                  <div className="w-1/4">Plan</div>
                  <div className="w-1/4">Last Deployed</div>
                  <div className="w-1/4"></div>
                </div>
                {applications.map((database, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-between items-center font-semibold py-2"
                  >
                    <div className="w-1/3">{database.applicationName}</div>
                    <div className="w-1/4">{database.status}</div>
                    <div className="w-1/4">{database.plan}</div>
                    <div className="w-1/4">{database.lastDeployment}</div>
                    <div className="w-1/4">
                      <button
                        className="text-red-600 pointer"
                        onClick={() => deleteApplication(applications.id)}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center">There are no Applications.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
