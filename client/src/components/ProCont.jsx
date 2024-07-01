import { FiDatabase } from "react-icons/fi";
import { FaMoneyCheckDollar } from "react-icons/fa6";
function ProCont() {
  return (
    <>
      <p className="py-4 mt-8 font-semibold">Total monthly cost</p>
      <div className="flex flex-col  border border-solid border-black rounded  justify-start items-lefts text-md font-semibold py-4 px-6 w-[500px] bg-white">
        <div className="flex flex-row  justify-between items-center py-3 gap-1 ">
          <div className="flex flex-row items-center">
            <div className="w-[20px] h-auto">
              <FiDatabase />
            </div>
            <div>primary node</div>
          </div>
          <div>$200</div>
        </div>
        <div className="w-11/12 h-[2px] m-auto border border-black border-solid"></div>
        <div className="flex flex-row  justify-between items-center py-3 gap-1">
          <div className="flex flex-row items-center">
            <div className="w-[20px] h-auto">
              <FaMoneyCheckDollar />
            </div>
            <div>total cost</div>
          </div>
          <div>$200/month</div>
        </div>
      </div>
    </>
  );
}

export default ProCont;
