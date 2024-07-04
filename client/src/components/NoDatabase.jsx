import rocket from "../assets/space/spaceman.jpg";
function NoDatabase() {
  return (
    <div className="flex flex-col py-6 w-11/12 h-[55vh] bg-white  shadow-xl m-auto border border-solid border-gray-200 rounded text-center items-center justify-center">
      <div className="w-3/12 border rounded-full  shadow-lg h-auto m-auto ">
        <img
          className="w-full border rounded-full shadow-inner h-full object-cover"
          src={rocket}
          alt="img"
        />
      </div>
      <p className="text-lg font-bold pt-4">Hurray</p>
      <p className="pb-4 mb-2">You dont have more databases to review.</p>
    </div>
  );
}

export default NoDatabase;
