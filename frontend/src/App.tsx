import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ROUTES } from "./common/constant/routes";

import Landing from "pages/Landing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.LANDING} element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
