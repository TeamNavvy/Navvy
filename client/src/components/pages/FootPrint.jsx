import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "../../map.css";
import L from "leaflet";
import { useState, useEffect, useRef } from "react";
L.Icon.Default.imagePath =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/";
import axios from "axios";
import { useUser } from "../UserContext";
import { FamilySelect } from "./FamilySelect";
import { use } from "react";


export const FootPrint = () => {
  // セッションのユーザー情報の取得
  const { user, setUser } = useUser();
  //家族一覧
  const [familyArray, setfamilyArray] = useState([]);
  //選択された家族
  const [selectedFamily, setSelectedFamily] = useState(null);
   let navigate = useNavigate();
  

  //家族取得
  const getFamily = async () => {

     try {
      const res = await axios.get(`/api/family/${user.id}`);
      console.log("familydata",res.data);
      setfamilyArray(res.data);
    } catch {
      setfamilyArray([]);
    }
  }

  //選択された家族格納
  const handleFamilyChange = (familyId) => {
    setSelectedFamily(familyId);
    console.log("選択された家族", familyId);
  };


   useEffect(() => {
    getFamily();
  
  }, []);

   return (
    <>
    <h1>足あと表示ページ</h1>
  
          <button onClick={() => navigate("/home")}>ホームに戻る</button>

          {/* 表示ユーザ選択プルダウン */}
          <FamilySelect
            familyArray={familyArray}
            onChangeFamily={handleFamilyChange}
          />
     
          {/* <MapContainer center={position} zoom={zoom}>
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
          </MapContainer> */}
        
    </>
   )
}