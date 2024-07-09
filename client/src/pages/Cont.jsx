import { Link } from "react-router-dom";
import icon from "../assets/icon.png";

function Cont() {
  return (
    <>
      <button className="relative text-sm">
        <div className="flex flex-row items-center w-full h-16 px-4 border-b border-white">
          <div className="w-full gap-2 flex text-center items-center justify-start flex-row h-auto m-auto">
            <div className="w-[30px] h-auto">
              <img className="w-full h-full object-cover" src={icon} />
            </div>
            <div className="text-lg font-medium">
              <Link to="/homepage">Cloud Wave</Link>
            </div>
          </div>
        </div>
        <div className="absolute z-10 flex-col items-start hidden w-full pb-1 bg-gray-800 shadow-lg group-focus:flex"></div>
      </button>
      <div className="flex flex-col p-4 overflow-auto border-b border-solid border-gray-500">
        <div className="flex items-center flex-shrink-0 h-10 px-2 mt-2 text-sm font-medium rounded hover:bg-gray-600">
          <Link to="/homepage">
            <span className="leading-none">HomePage</span>
          </Link>
        </div>
        <div className="flex items-center flex-shrink-0 h-10 px-2 mt-2 text-sm font-medium rounded hover:bg-gray-600">
          <Link to="/createdatabase">
            <span className="leading-none">Create Database</span>
          </Link>
        </div>
        <div className="flex items-center flex-shrink-0 h-10 px-2 mt-2 text-sm font-medium rounded hover:bg-gray-600">
          <Link to="/createapplication">
            <span className="leading-none">Deploy Application</span>
          </Link>
        </div>
      </div>
      <div className="flex flex-col p-4 overflow-auto border-b border-solid border-gray-500">
        {/*<div className="flex items-center flex-shrink-0 h-10 px-2 mt-2 text-sm font-medium rounded hover:bg-gray-600">*/}
        {/*  <Link to="/billing">*/}
        {/*    <span className="leading-none">Billing</span>*/}
        {/*  </Link>*/}
        {/*</div>*/}
        <div className="flex items-center flex-shrink-0 h-10 px-2 mt-2 text-sm font-medium rounded hover:bg-gray-600">
          <Link to="/help">
            <span className="leading-none">Help</span>
          </Link>
        </div>
      </div>
      <div className="flex flex-col p-4 overflow-auto border-b border-solid border-gray-500">
        <div className="flex items-center flex-shrink-0 h-10 px-2 mt-2 text-sm font-medium rounded hover:bg-gray-600">
          <Link to="/aboutUs">
            <span className="leading-none">About Us</span>
          </Link>
        </div>
        <div className="flex items-center flex-shrink-0 h-10 px-2 mt-2 text-sm font-medium rounded hover:bg-gray-600">
          <Link to="/contactus">
            <span className="leading-none">Contact Us</span>
          </Link>
        </div>
        <div className="flex items-center flex-shrink-0 h-10 px-2 mt-2 text-sm font-medium rounded hover:bg-gray-600">
          <Link to="/feedback">
            <span className="leading-none">FeedBack</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Cont;
