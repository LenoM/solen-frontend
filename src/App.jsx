import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./features/login";
import RequireAuth from "./services/auth";
import { features } from "./features/index";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<RequireAuth />}>
            {features.map((el, idx) => {
              return <Route key={idx} path={el.path} element={el.element} />;
            })}
          </Route>

          <Route path="login" element={<Login />} />

          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
