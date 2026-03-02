import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import L from "leaflet";
import { useState, useEffect } from "react";
L.Icon.Default.imagePath =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/";

export const Home = () => {
  // const { currentPosition } = props;
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
  // 初期値の緯度経度
  const position = [currentPosition.latitude, currentPosition.longitude];
  const markerPosition = [currentPosition.latitude, currentPosition.longitude];
  const markerPosition2 = [35.8, 139.61];
  // 初期マップズームレベル
  const zoom = 30;

  // useEffect(() => {
  //   fetch(`/api`)
  //     .then((res) => res.json())
  //     .then((data) => console.log(data, "******"));
  // }, []);

  return (
    <>
      <h1>地図表記デモ</h1>
      <MapContainer center={position} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={markerPosition}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Marker position={markerPosition2}>
          <Popup>2つ目だよーーー</Popup>
        </Marker>
      </MapContainer>
    </>
  );
};
