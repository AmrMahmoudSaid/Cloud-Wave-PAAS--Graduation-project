import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import SignOut from "../components/SignOut";

import Cont from "./Cont";

export default function Help() {
  const navigate = useNavigate();
  return (
    <div className="flex w-screen h-screen text-white bg-[#041b4d]">
      <div className="flex flex-col w-[220px] border-r border-gray-800">
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
          <div className="flex flex-col">
            <p className="font-bold text-5xl px-2 py-10 text-[#041b4d] opacity-90">
              Help
            </p>
            <div className="flex-1 bg-white p-2">
              <section className="mb-8">
                <h2 className="text-4xl font-semibold mb-4">Getting Started</h2>
                <p className="mb-4 text-lg">
                  Follow these steps to get started with our PaaS application:
                </p>
                <ol className="list-decimal list-inside text-lg">
                  <li className="mb-2">Sign up for an account.</li>
                  <li className="mb-2">
                    Connect your CreditCard to your account.
                  </li>
                  <li className="mb-2">Log in with your credentials.</li>
                  <li className="mb-2">Create a new Database.</li>
                  <li className="mb-2">Create a new project.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-4xl font-semibold mb-4">
                  Dashboard Overview
                </h2>
                <p className="mb-4 text-lg">
                  Once logged in, you will be taken to the dashboard where you
                  can:
                </p>
                <ul className="list-disc list-inside text-lg">
                  <li className="mb-2">View your account details.</li>
                  <li className="mb-2">Manage your projects.</li>
                  <li className="mb-2">Manage your Databases.</li>
                  <li className="mb-2">View your subscribed plans.</li>
                  <li className="mb-2">Access support resources.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-4xl font-semibold mb-4">
                  Creating a New Database
                </h2>
                <p className="mb-4 text-lg">To create a new Database:</p>
                <ol className="list-decimal list-inside text-lg">
                  <li className="mb-2">
                    Navigate to the Database section from the dashboard.
                  </li>
                  <li className="mb-2">
                    Click on the "Create{" "}
                    <a
                      href="/createdatabase"
                      className="text-blue-600 hover:underline"
                    >
                      New Database
                    </a>
                    " button.
                  </li>
                  <li className="mb-2">
                    Fill in the required Database details and save.
                  </li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-4xl font-semibold mb-4">
                  Deploying a New Project
                </h2>
                <p className="mb-4 text-lg">To create and deploy a project:</p>
                <ol className="list-decimal list-inside text-lg">
                  <li className="mb-2">
                    Navigate to the Projects section from the dashboard.
                  </li>
                  <li className="mb-2">
                    Click on the "
                    <a
                      href="/createapplication"
                      className="text-blue-600 hover:underline"
                    >
                      Deploy Project
                    </a>
                    " button.
                  </li>
                  <li className="mb-2">
                    Fill in the required project details and save.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-4xl font-semibold mb-4">Support</h2>
                <p className="mb-4 text-lg">If you need help, you can:</p>
                <ul className="list-disc list-inside text-lg">
                  <li className="mb-2">
                    Visit our{" "}
                    <a
                      href="/contactUs"
                      className="text-blue-600 hover:underline"
                    >
                      Support Page
                    </a>
                    .
                  </li>
                  <li className="mb-2">
                    Contact our support team using the Contact Us page.
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
