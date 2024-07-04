import Footer from "../components/Footer";
import Cont from "./Cont";
function Billing() {
  return (
    <div className="flex w-screen h-screen text-white  bg-[#041b4d]">
      <Cont />
      <div className="flex flex-col flex-grow bg-white   text-black">
        <div className="flex items-center justify-between  flex-shrink-0 h-16 px-8 border-b border-gray-500">
          <h1 className="text-2xl font-bold text-[#041b4d] opacity-85">
            HomePage
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
        <div className="flex-grow p-6 overflow-auto bg-white px-10">
          <div className="flex flex-col">
            <p className="px-1 text-[13px] opacity-60 leading-[2px] font-semibold py-1 mt-4">
              Note: Information on this page is updated daily
            </p>
            <p className="font-bold text-5xl  text-[#041b4d] opacity-85 ">
              Billing
            </p>

            <div className="flex flex-col w-11/12 h-[40vh] bg-white border border-solid  rounded mt-20 shadow-xl m-auto px-2 text-black">
              <div className="flex flex-col py-4 px-4">
                <div className="text-3xl font-bold text-[#041b4d] opacity-85">
                  Estimated Due
                </div>
                <div className="text-4xl py-2 text-[#041b4d] opacity-85">
                  $0.00
                </div>
                <div className="text-gray font-semibold text-md py-2 opacity-60">
                  This is an estimate of the ammount you owe based on your
                  current month-to-date usage after credit & payments.
                </div>
                <div className="w-11/12 border-b-2 border-solid border-black m-auto py-2"></div>
                <div className="flex flex-row mt-8 items-center text-center  px-10 justify-between  ">
                  <div className="flex flex-col ">
                    <div className="text-md font-semibold text-gray-500">
                      Credit applied
                    </div>
                    <div className="text-sm font-bold text-[#041b4d] opacity-85">
                      $0.00
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-md font-semibold text-gray-500">
                      Prepayments
                    </div>
                    <div className="text-sm font-bold text-[#041b4d] opacity-85">
                      $0.00
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-md font-semibold text-gray-500">
                      Total Usage
                    </div>
                    <div className="text-sm font-bold text-[#041b4d] opacity-85">
                      $0.00
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
