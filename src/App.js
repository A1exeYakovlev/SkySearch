import Sidebar from "./components/Sidebar";
import FlightList from "./components/FlightList";
import Logo from "./components/Logo";

function App() {
  return (
    <div className="app">
      <div className="container">
        <Logo />
        <Sidebar></Sidebar>
        <FlightList></FlightList>
      </div>
    </div>
  );
}

export default App;
