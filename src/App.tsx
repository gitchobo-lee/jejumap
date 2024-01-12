import { RecoilRoot } from "recoil";
import "./App.css";
import Router from "./pages/Router";

function App() {
  return (
    <RecoilRoot>
      <Router />
    </RecoilRoot>
  );
}

export default App;
