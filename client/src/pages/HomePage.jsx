import Cont from "./Cont";

function HomePage() {
  return (
    <div className="flex w-screen h-screen text-white bg-[#041b4d]">
      <Cont />
      <div className="flex flex-col flex-grow bg-white text-black">
        <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-gray-500">
          <h1 className="text-2xl font-bold">HomePage</h1>
          <button className="relative text-sm focus:outline-none group">
            <div className="flex items-center justify-between w-32 h-10 px-4 border rounded hover:bg-gray-800">
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
          <div className="grid grid-cols-3 gap-6">
            {/* <div className="col-span-3 rounded-lg bg-white border-2 border-solid border-black h-[600px]"></div> */}

            {/* <div className="col-span-3 rounded-lg bg-gray-900 h-[596px]"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
