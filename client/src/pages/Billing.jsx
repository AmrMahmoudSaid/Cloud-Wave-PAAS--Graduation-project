import Footer from "../components/Footer";
import Cont from "./Cont";
import SignOut from "../components/SignOut";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Billing() {
  const [databaseBilling, setDatabaseBilling] = useState(0);
  const [appBilling, setAppBilling] = useState(0);
  const navigate = useNavigate();
  const fetchAppBilling = async () => {
    try {
      const response = await axios.get(
        "https://cloud.dev/api/applications/management/billing"
      );
      console.log("App billing found:", response.data);
      setAppBilling(response.data.total);
    } catch (error) {
      console.error("Failed to fetch Applications:", error);
    }
  };
  const fetchDatabaseBilling = async () => {
    try {
      const response = await axios.get("/api/database/management/billing");
      setDatabaseBilling(response.data.total);
    } catch (error) {
      console.error("Failed to fetch database billing:", error);
    }
  };

  useEffect(() => {
    fetchDatabaseBilling();
    fetchAppBilling();
  }, []);

  return (
    <div className="flex w-screen h-screen text-white bg-[#041b4d]">
      <div className="flex flex-col w-[220px] border-r border-gray-800">
        <Cont />
      </div>
      <div className="flex flex-col flex-grow w-full bg-white text-black">
        <div className="flex items-center justify-between h-16 px-8 border-b border-gray-500">
          <h1 className="text-2xl font-bold text-[#041b4d] opacity-85">
            HomePage
          </h1>
          <button className="relative flex flex-row gap-2 text-center right-24 items-center text-sm focus:outline-none group">
            <div className="text-lg font-semibold text-[#041b4d] opacity-90">
              MY Account
            </div>
            <div className="flex w-8 h-8 rounded-full border bg-[#071952] hover:bg-[#041b4d] hover:text-white">
              <div className="font-medium text-white text-center items-center m-auto">
                CV
              </div>
            </div>
            <div className="absolute w-[200px] border rounded border-solid border-black z-10 top-[55px] flex-col right-[2px] items-start hidden pb-1 bg-white shadow-lg group-focus:flex">
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
        <div className="flex-grow p-6 overflow-auto bg-white px-10">
          <div className="flex flex-col">
            <p className="px-1 text-[13px] opacity-60 leading-[2px] font-semibold py-1 mt-4">
              Note: Information on this page is updated daily
            </p>
            <p className="font-bold text-5xl text-[#041b4d] opacity-85">
              Billing
            </p>

            <div className="flex flex-col w-11/12 h-[40vh] bg-white border border-solid rounded mt-20 shadow-xl m-auto px-2 text-black">
              <div className="flex flex-col py-4 px-4">
                <div className="text-3xl font-bold text-[#041b4d] opacity-85">
                  Estimated Due
                </div>
                <div className="text-4xl py-2 text-[#041b4d] opacity-85">
                  ${databaseBilling.toFixed(2 + appBilling)}
                </div>
                <div className="text-gray font-semibold text-md py-2 opacity-60">
                  This is an estimate of the amount you owe based on your
                  current month-to-date usage after credit & payments.
                </div>
                <div className="w-11/12 border-b-2 border-solid border-black m-auto py-2"></div>
                <div className="flex flex-row mt-8 items-center text-center px-10 justify-between">
                  <div className="flex flex-col">
                    <div className="text-md font-semibold text-gray-500">
                      Credit applied
                    </div>
                    <div className="text-sm font-bold text-[#041b4d] opacity-85">
                      ${databaseBilling.toFixed(2 + appBilling)}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-md font-semibold text-gray-500">
                      Prepayments
                    </div>
                    <div className="text-sm font-bold text-[#041b4d] opacity-85">
                      ${databaseBilling.toFixed(2 + appBilling)}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-md font-semibold text-gray-500">
                      Total Usage
                    </div>
                    <div className="text-sm font-bold text-[#041b4d] opacity-85">
                      ${databaseBilling.toFixed(2 + appBilling)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <p className="font-bold text-3xl px-2 mt-10 py-10">
              MY Applications
            </p> */}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Billing;
