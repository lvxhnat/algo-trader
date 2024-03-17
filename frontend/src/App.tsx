import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ROUTES } from "./common/constant/routes";

import Landing from "pages/Landing";
import Contract from "pages/[Contract]";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.LANDING} element={<Landing />} />
        <Route path={`${ROUTES.CONTRACT}/:conId`} element={<Contract />} />
      </Routes>
    </Router>
  );
}

export default App;
