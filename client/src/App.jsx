import { useState, useEffect } from "react";
import { Home } from "./pages/Home";
import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
  const [currentPosition, setCurrentPosition] = useState();

  const handleGetPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const result = position.coords;
      setCurrentPosition(result);
    });
  };

  useEffect(() => {
    handleGetPosition();
  }, []);

  if (!currentPosition) {
    return <div>現在地取得中、お待ちください</div>;
  }
  return (
    <>
      <Home currentPosition={currentPosition} />
    </>
  );
}

export default App;
