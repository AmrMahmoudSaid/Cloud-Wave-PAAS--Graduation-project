import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signing from "./signing/sign";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signing />} />
        {/* <Route path="/inctructorSign" element={<Instructorsign />} />
        <Route path="/usersign" element={<Usersign />} />
        <Route path="/user/home" element={<Userhome />} />
        <Route path="/instructor/home" element={<Instercutorhome />} />
        <Route path="/instructor/createcourse" element={<Createcourse />} />
        <Route path="/instructor/instSearch" element={<Inssearch />} />
        <Route
          path="/instructor/courseInrollment"
          element={<Courseinrollment />}
        />
        <Route path="/user/usersearch" element={<Usersearch />} />
        <Route path="/user/allcourses" element={<Allcourses />} />
        <Route path="/user/DisplayReview" element={<DisplayReview />} />
        <Route path="/user/DisplayReview/makeReview" element={<Makereview />} />
        <Route path="/admin/home" element={<Adminhmome />} />
        <Route path="/admin/home/useraccounts" element={<Useraccounts />} />
        <Route path="/admin/home/instaccounts" element={<Instaccounts />} />
        <Route path="/admin/home/courses" element={<Courses />} />
        <Route path="/user/notifications" element={<Notifications />} />
        <Route path="/admin/home/courses/edit" element={<Edit />} />
        <Route path="/admin/home/workflow" element={<Workflow />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
