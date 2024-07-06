import Footer from "../components/Footer";
import SignOut from "../components/SignOut";
import Profile from "../components/Profile";
import Cont from "./Cont";
import Contact from "../assets/Contactus.jpg";

export default function ContactUs() {
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "2d878b7b-f764-4093-9edc-be395e0a2fdc");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      console.log("Success", res);
    }
  };
  return (
    <div className="flex w-screen h-screen text-white bg-[#041b4d]">
      <div className="flex flex-col w-[364px] border-r border-gray-800">
        <Cont />
      </div>
      <div className="flex flex-col min-h-screen flex-grow bg-white text-black">
        <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-gray-500">
          <h1 className="text-2xl font-bold text-[#041b4d] opacity-90">
            Contact us
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
              <Profile />
              <SignOut />
            </div>
          </button>
        </div>
        <div className="flex-grow p-6  overflow-auto bg-white px-20">
          <div className="flex flex-col ">
            <p className="font-bold text-3xl px-2 py-10 text-[#041b4d] opacity-90">
              {/* <div className="mb-5">
                <h2 className="font-semibold text-blue-900 text-4xl mb-1">
                  Get in touch
                </h2>
                <hr className="border-none w-30 h-1 bg-blue-900 rounded mb-5" />
              </div> */}
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <form
              onSubmit={onSubmit}
              className="flex flex-col items-start gap-5 w-full max-w-lg"
            >
              <div className="mb-5">
                <h2 className="font-semibold text-blue-900 text-4xl mb-1">
                  Get in touch
                </h2>
                <hr className="border-none w-30 h-1 bg-blue-900 rounded mb-5" />
              </div>
              <input
                type="hidden"
                name="access_key"
                value="2d878b7b-f764-4093-9edc-be395e0a2fdc"
              />
              <input
                type="text"
                name="name"
                placeholder="Your name"
                className="w-full h-12 border-2 border-blue-900 outline-none pl-6 font-medium text-black rounded-full"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                className="w-full h-12 border-2 border-blue-900 outline-none pl-6 font-medium text-black rounded-full"
                required
              />
              <textarea
                name="message"
                placeholder="Your message"
                className="w-full h-36 border-2 border-blue-900 outline-none pl-6 pt-4 font-medium text-black rounded-2xl"
                required
              ></textarea>
              <button
                type="submit"
                className="flex items-center px-8 py-3 text-lg bg-blue-900 text-white gap-2 rounded-full cursor-pointer"
              >
                Submit
              </button>
            </form>
            <img
              src={Contact}
              alt="Contact us"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
