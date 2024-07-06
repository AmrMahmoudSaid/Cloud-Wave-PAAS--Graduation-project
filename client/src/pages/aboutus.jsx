import Footer from "../components/Footer";
import SignOut from "../components/SignOut";
import Profile from "../components/Profile";
import Cont from "./Cont";

export default function AboutUs() {
  return (
    <div className="flex w-screen h-screen text-white bg-[#041b4d]">
      <div className="flex flex-col w-[220px] border-r border-gray-800">
        <Cont />
      </div>
      <div className="flex flex-col min-h-screen flex-grow bg-white text-black">
        <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-gray-500">
          <h1 className="text-2xl font-bold text-[#041b4d] opacity-90">
            About us
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
            {/* <p className="font-bold text-3xl px-2 py-10 text-[#041b4d] opacity-90">
              Cloud Wave
            </p> */}
          </div>
          <div className="container mx-auto mt-6">
            <div className="p-6 bg-white space-y-6">
              <h1 className="font-bold text-3xl px-2 py-10 text-[#041b4d] opacity-90">
                Cloud Wave
              </h1>

              <details className="bg-gray-100 p-4 rounded-lg shadow">
                <summary className="text-2xl font-semibold mb-2 cursor-pointer">
                  1. Motivation
                </summary>
                <p className="text-gray-700 mt-2">
                  In recent years, the rapid advancement of cloud computing
                  technologies has revolutionized how organizations deploy,
                  manage, and scale their applications. Traditional IT
                  infrastructure, with its inherent limitations and
                  complexities, has often struggled to keep pace with the
                  demands of modern applications and the need for agility in
                  business operations. This shift has highlighted the necessity
                  for a more efficient, scalable, and automated approach to
                  application management, paving the way for
                  Platform-as-a-Service (PAAS) solutions.
                </p>
                <p className="text-gray-700 mt-2">
                  Cloud-Wave-PAAS is motivated by the desire to address the
                  specific pain points experienced by developers and IT
                  administrators. By leveraging the latest advancements in
                  containerization, orchestration, and automation, Cloud-Wave
                  PAAS aims to provide a seamless, efficient, and powerful
                  platform for application management.
                </p>
              </details>

              <details className="bg-gray-100 p-4 rounded-lg shadow">
                <summary className="text-2xl font-semibold mb-2 cursor-pointer">
                  2. Objective
                </summary>
                <p className="text-gray-700 mt-2">
                  The objective of Cloud-Wave-PAAS is to develop a
                  Platform-as-a-Service that simplifies the application
                  deployment process, enhances scalability, and reduces
                  operational overhead. The project aims to deliver a
                  user-friendly platform that provides:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                  <li>Automated Deployment</li>
                  <li>Container Orchestration</li>
                  <li>Monitoring and Analytics</li>
                  <li>Integration Capabilities</li>
                  <li>Enhanced User Experience</li>
                </ul>
              </details>

              <details className="bg-gray-100 p-4 rounded-lg shadow">
                <summary className="text-2xl font-semibold mb-2 cursor-pointer">
                  3. Methodology
                </summary>
                <p className="text-gray-700 mt-2">
                  Well as we are using microservices architecture the
                  development process can get so complicated, but we tried to
                  apply best development best practices.
                </p>
                <p className="text-gray-700 mt-2">
                  We used Git and GitHub as a version control and Docker for
                  containerization and Kubernetes for orchestration and we will
                  talk about how we applied and used these technologies in the
                  deployment strategy section in greater detail.
                </p>
              </details>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
