import { Routes, Route } from "react-router-dom";
import Map from "./map/Map";
function Router() {
  return (
    <Routes>
      <Route path='/' element={<Map />} />
    </Routes>
  );
}

export default Router;
