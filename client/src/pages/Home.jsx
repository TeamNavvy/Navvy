import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./map.css";
import L from "leaflet";
L.Icon.Default.imagePath =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/";

export const Home = () => {
  // 初期値の緯度経度
  const position = [35.8, 139.6];
  const markerPosition = [35.81, 139.6];
  const markerPosition2 = [35.8, 139.61];
  // 初期マップズームレベル
  const zoom = 13;

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
