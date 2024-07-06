import { useEffect, useState } from "react";
import Cont from "./Cont";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useNavigate } from "react-router-dom";
import NoDatabase from "../components/NoDatabase";
import NoApps from "../components/NoApps";
import Footer from "../components/Footer";
import SignOut from "../components/SignOut";
import PendingProg from "../components/PendingProg";
import CreatingProg from "../components/CreatingProg";
import RunningProg from "../components/RunningProg";
function HomePage() {
  const [databases, setDatabases] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();
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
  }, []);
  const handleClickApp = (id) => {
    localStorage.setItem("appId", id);
    navigate("/applogs");
  };
  const handleClickDatabase = (id) => {
    localStorage.setItem("databaseId", id);
    navigate("/databaselogs");
  };
  return (
    <div className="flex w-screen h-screen text-white bg-[#041b4d]">
      <div className="flex flex-col w-[364px] border-r border-gray-800">
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
              My Databases
            </p>
            {databases.length > 0 ? (
              <div className="flex flex-col py-6 w-11/12 h-[30vh] bg-white  shadow-xl m-auto border border-solid  border-[#041b4d] rounded text-center items-center justify-center">
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
                      <div
                        className="w-1/3"
                        onClick={() => handleClickDatabase(database.id)}
                      >
                        {database.deploymentName}
                      </div>
                      <div className="w-1/4 text-center items-center">
                        {database.status == "pending" && <PendingProg />}
                        {database.status == "creating" && <CreatingProg />}
                        {database.status == "running" && <RunningProg />}
                      </div>
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
              </div>
            ) : (
              <NoDatabase />
            )}
            <p className="font-bold text-3xl px-2 mt-10 py-10 text-[#041b4d] opacity-90">
              MY Applications
            </p>
            {applications.length > 0 ? (
              <div className="flex flex-col py-6 w-11/12 h-[30vh] bg-white  shadow-xl m-auto border border-solid  border-[#041b4d] rounded text-center items-center justify-center">
                <div className="flex flex-col w-11/12 m-auto font-bold px-2">
                  <div className="flex flex-row justify-between items-center border-b py-2 border-solid border-black">
                    <div className="w-1/3">Service Name</div>
                    <div className="w-1/4">Status</div>
                    <div className="w-1/4">Plan</div>
                    <div className="w-1/4">Last Deployed</div>
                    <div className="w-1/4"></div>
                  </div>
                  {applications.map((application, index) => (
                    <div
                      key={index}
                      className="flex flex-row justify-between items-center font-semibold py-2"
                    >
                      <div
                        className="w-1/3"
                        onClick={() => handleClickApp(application.id)}
                      >
                        {application.applicationName}
                      </div>
                      <div className="w-1/4 text-center items-center">
                        {application.status == "pending" && <PendingProg />}
                        {application.status == "creatin" && <CreatingProg />}
                        {application.status == "running" && <RunningProg />}
                      </div>
                      <div className="w-1/4">{application.plan}</div>
                      <div className="w-1/4">{application.lastDeployment}</div>
                      <div className="w-1/4">
                        <button
                          className="text-red-600 pointer"
                          onClick={() => deleteApplication(application.id)}
                        >
                          <DeleteOutlineOutlinedIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <NoApps />
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
