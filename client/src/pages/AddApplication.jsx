import { useState } from "react";
import Cont from "./Cont";

import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import { BsCheckLg } from "react-icons/bs";
import Basic from "../assets/Basic.svg";
import Pro from "../assets/Pro.svg";
import Super from "../assets/Super.svg";
import BasicCont from "../components/BasicCont";
import ProCont from "../components/ProCont";
import SuperCont from "../components/SuperCont";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LiaDocker } from "react-icons/lia";
import { IoLogoNodejs } from "react-icons/io5";
import { RiReactjsLine } from "react-icons/ri";
import { SiSpringboot } from "react-icons/si";
import Footer from "../components/Footer";

function AddApplication() {
  const [selectedApplication, setSelectedApplication] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [name, setname] = useState("");
  const [url, seturl] = useState("");
  const [port, setport] = useState("");
  const [envVariables, setEnvVariables] = useState([{ key: "", value: "" }]);
  const navigate = useNavigate();
  const handleDatabaseChange = (e) => {
    setSelectedApplication(e.target.value);
  };

  const handlePriceChange = (e) => {
    setSelectedPrice(e.target.value);
  };
  const handleEnvChange = (index, field, value) => {
    const newEnvVariables = [...envVariables];
    newEnvVariables[index][field] = value;
    setEnvVariables(newEnvVariables);
  };

  const handleAddEnvVariable = () => {
    setEnvVariables([...envVariables, { key: "", value: "" }]);
  };
  const URL = "https://cloud.dev/api/applications/orders/new";
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(URL, {
        name: name,
        url: url,
        port: port,
        plan: selectedPrice,
        applicationOrderType: selectedApplication,
        envVariables: envVariables,
      });

      // localStorage.setItem("userId", response.data.data.id);

      // if (localStorage.getItem("userId")) {
      navigate("/homepage");
      // } else {
      //   navigate("/login");
      // }
      console.log(response.data);
    } catch (error) {
      console.error("Subscription failed", error);
    }
  };

  return (
    <div className="flex w-screen h-screen text-white bg-[#041b4d]">
      <Cont />
      <div className="flex flex-col flex-grow bg-white text-black">
        <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-gray-500">
          <h1 className="text-2xl font-bold text-[#041b4d] opacity-90">
            Create Application Engine
          </h1>
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
            <p className="font-bold text-3xl px-2 py-6 text-[#041b4d] opacity-90">
              Choose Application Engine
            </p>
            <RadioGroup
              required
              value={selectedApplication}
              onChange={handleDatabaseChange}
            >
              <div className="flex flex-col px-28 mt-20 gap-3">
                <div className="flex flex-row border border-solid border-black rounded items-center justify-start text-md font-semibold py-4 px-6 w-[500px] bg-white hover:bg-gray-200">
                  <FormControlLabel value="DockerImage" control={<Radio />} />
                  <div className="w-6 font-bold h-auto text-blue-800">
                    <LiaDocker />
                  </div>
                  Docker image
                </div>
                <div className="flex flex-row border border-solid border-black rounded items-center justify-start text-md font-semibold py-4 px-6 w-[500px] bg-white hover:bg-gray-200">
                  <FormControlLabel value="Express" control={<Radio />} />
                  <div className="w-6 font-bold h-auto text-blue-800">
                    <IoLogoNodejs />
                  </div>
                  Express
                </div>
                <div className="flex flex-row border border-solid border-black rounded items-center justify-start text-md font-semibold py-4 px-6 w-[500px] bg-white hover:bg-gray-200">
                  <FormControlLabel value="React" control={<Radio />} />
                  <div className="w-6 font-bold h-auto text-blue-800">
                    <RiReactjsLine />
                  </div>
                  React
                </div>
                <div className="flex flex-row border border-solid border-black rounded items-center justify-start text-md font-semibold py-4 px-6 w-[500px] bg-white hover:bg-gray-200">
                  <FormControlLabel value="Spring" control={<Radio />} />
                  <div className="w-6 font-bold h-auto text-blue-800">
                    <SiSpringboot />
                  </div>
                  Spring
                </div>
              </div>
            </RadioGroup>
            <p className="font-bold text-4xl px-2 py-24 text-[#041b4d] opacity-90">
              Pick an instance type
            </p>
            <RadioGroup
              required
              value={selectedPrice}
              onChange={handlePriceChange}
            >
              <div className="flex flex-row justify-center place-content-center	w-full gap-12   ">
                <div className="flex flex-col border border-solid border-black rounded  justify-start text-md font-semibold w-[25%] py-4  h-[60vh]  bg-white hover:bg-gray-200">
                  <div className="flex flex-row items-center justify-between px-8 ">
                    <p className="font-medium py-5">Basic</p>
                    <FormControlLabel value="Basic" control={<Radio />} />
                  </div>
                  <div className="flex flex-row px-4 mt-5 items-center gap-4">
                    <BsCheckLg />
                    <p> RAM: 1</p>
                  </div>
                  <div className="flex flex-row px-4 items-center gap-4">
                    <BsCheckLg />
                    <p> CPU: 1</p>
                  </div>
                  <div className="flex flex-row px-4 items-center gap-4">
                    <BsCheckLg />
                    <p> Storage: 1</p>
                  </div>
                  <p className="px-4 py-4">
                    Low cost dynos to test ideas or run apps that see
                    intermittent use.
                  </p>
                  <div className="w-44 h-auto m-auto items-center justify-center">
                    <img src={Basic} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex flex-col border border-solid border-black rounded  justify-start text-md font-semibold w-[25%] py-4 px-30  h-[60vh] bg-white hover:bg-gray-200">
                  <div className="flex flex-row items-center justify-between px-8 ">
                    <p className="font-medium py-5">Pro</p>
                    <FormControlLabel value="Pro" control={<Radio />} />
                  </div>
                  <div className="flex flex-row px-4 mt-5 items-center gap-4">
                    <BsCheckLg />
                    <p> RAM: 4</p>
                  </div>
                  <div className="flex flex-row px-4 items-center gap-4">
                    <BsCheckLg />
                    <p> CPU: 1</p>
                  </div>
                  <div className="flex flex-row px-4 items-center gap-4">
                    <BsCheckLg />
                    <p> Storage: 10</p>
                  </div>
                  <p className="px-4 py-1 mt-3 ">
                    Business-focused apps, such as custtomer-facing or internal
                    web apps and APIs
                  </p>
                  <div className="w-44 h-auto m-auto items-center justify-center">
                    <img src={Pro} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex flex-col border border-solid border-black rounded  justify-start text-md font-semibold w-[25%] py-4   h-[60vh] bg-white hover:bg-gray-200">
                  <div className="flex flex-row items-center justify-between px-8 ">
                    <p className="font-medium py-5">Super</p>
                    <FormControlLabel value="Super" control={<Radio />} />
                  </div>
                  <div className="flex flex-row px-4 items-center mt-5 gap-4">
                    <BsCheckLg />
                    <p> RAM: 8</p>
                  </div>
                  <div className="flex flex-row px-4 items-center gap-4">
                    <BsCheckLg />
                    <p> CPU: 2</p>
                  </div>
                  <div className="flex flex-row px-4 items-center gap-4">
                    <BsCheckLg />
                    <p> Storage: 50</p>
                  </div>
                  <p className="px-4 py-1 mt-3">
                    Mission-critical apps with complex functionality that
                    require high availability.
                  </p>
                  <div className="w-44 h-auto m-auto items-center justify-center">
                    <img src={Super} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </RadioGroup>
            <p className="font-bold text-4xl px-2 py-16 text-[#041b4d] opacity-90">
              Finalize and Create
            </p>
            <div className="flex flex-col gap-3 px-[120px]">
              <p className=" font-semibold">Choose a unique application name</p>
              <p className="w-1/2 text-sm text-gray-500">
                Names must be in lowercase. They can be between 3 and 30
                characters long and may contain dashes.
              </p>
              <p className="mt-4 font-semibold">Application Name</p>
              <input
                  type="text"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  placeholder="Enter application Name"
                  required
                  className="flex flex-row border border-solid border-black rounded items-center justify-start text-md font-semibold  py-4 px-6 w-[500px] bg-white hover:bg-gray-200"
              />
              <p className="mt-4 font-semibold">Github Repo URL</p>
              <input
                  type="text"
                  value={url}
                  onChange={(e) => seturl(e.target.value)}
                  placeholder="Enter repository url"
                  required
                  className="flex flex-row border border-solid border-black rounded items-center justify-start text-md font-semibold py-4 px-6 w-[500px] bg-white hover:bg-gray-200"
              />
              <p className="mt-4 font-semibold">Application Port</p>
              <input
                  type="text"
                  value={port}
                  onChange={(e) => setport(e.target.value)}
                  placeholder="Enter application port"
                  required
                  className="flex flex-row border border-solid border-black rounded items-center justify-start text-md font-semibold py-4 px-6 w-[500px] bg-white hover:bg-gray-200"
              />
              <div className="w-full flex flex-col items-center justify-center gap-4">
                <label>Environment Variables:</label>
                {envVariables.map((env, index) => (
                    <div key={index} className="w-full flex flex-row items-center gap-4">
                      <input
                          type="text"
                          placeholder="Key"
                          className="border rounded p-2"
                          value={env.key}
                          onChange={(e) => handleEnvChange(index, "key", e.target.value)}
                      />
                      <input
                          type="text"
                          placeholder="Value"
                          className="border rounded p-2"
                          value={env.value}
                          onChange={(e) => handleEnvChange(index, "value", e.target.value)}
                      />
                    </div>
                ))}
                <button
                    className="border rounded p-2 bg-blue-500 text-white"
                    onClick={handleAddEnvVariable}
                >
                  Add Environment Variable
                </button>
              </div>
              <div className="w-auto h-auto">
                {selectedPrice === "Basic" && <BasicCont/>}
                {selectedPrice === "Pro" && <ProCont/>}
                {selectedPrice === "Super" && <SuperCont/>}
              </div>
              <input
                  className="bg-[green] cursor-pointer items-center justify-center text-center border rounded w-[150px]  mt-5 text-white py-3"
                  value="Deploy Application"
                  onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
}

export default AddApplication;
