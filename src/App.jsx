import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "@/features/login";
import RequireAuth from "@/utils/required-auth";
import { features } from "@/features/index";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading..</div>}>
        <Routes>
          <Route element={<RequireAuth />}>
            {features.map((el, idx) => {
              return (
                <Route
                  key={idx}
                  path={el.path}
                  element={el.element}
                  lazy={true}
                />
              );
            })}
          </Route>

          <Route path="login" element={<Login />} lazy={true} />

          <Route path="*" element={<Login />} lazy={true} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
