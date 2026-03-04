import { MapContainer, TileLayer} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "../../map.css";
import L from "leaflet";
import { useState, useEffect } from "react";
L.Icon.Default.imagePath =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/";
import axios from "axios";
import { useUser } from "../UserContext";
import { FamilySelect } from "./FamilySelect";
import { FootPrintMarker } from "../molecules/FootPrintMarker";
import { HeaderLayout } from "../templates/HeaderLayout";



export const FootPrint = () => {
  // セッションのユーザー情報の取得
  const { user, setUser } = useUser();
  //家族一覧
  const [familyArray, setfamilyArray] = useState([]);
  //選択された家族
  const [selectedFamily, setSelectedFamily] = useState(null);
  //選択された家族の足あと履歴
  const [history, setHistory] = useState([]);
  const [center, setCenter] = useState(null);
  //足あとがありかなしか判定
  const [footExist, setfootExist] = useState(false);
   let navigate = useNavigate();
  

  //家族取得
  const getFamily = async () => {
     try {
      const res = await axios.get(`/api/family/${user.id}`);
      console.log("familydata",res.data);
      setfamilyArray(res.data);

      //初期表示
      if (res.data.length > 0) {
      const firstFamily = res.data[0].id;
      setSelectedFamily(firstFamily);
      getHistory(firstFamily);
    }

    } catch {
      setfamilyArray([]);
    }
  }

  //選択された家族格納
  const handleFamilyChange = (familyId) => {
    setSelectedFamily(familyId);
    console.log("選択された家族", familyId);
    getHistory(familyId);
  };

  //選択されたユーザの足あと取得
  const getHistory = async (userId) => {

  const res = await axios.get(`/api/history/today/${userId}`);
  setHistory(res.data);

  if (res.data.length > 0) {
    setfootExist(true);
    setCenter([res.data[0].latitude, res.data[0].longitude]);
  } else {
    setfootExist(false);
    setCenter([35.18, 136.9]);
  }

  }

   useEffect(() => {
    getFamily();
  }, []);

  // 初期マップズームレベル
  const zoom = 30;

  
  if (!center) {
    return <div>地図読み込み中...</div>;
  }

   return (
    <HeaderLayout>
    <h1>今日の足あと</h1>
          {/* 表示ユーザ選択プルダウン */}
          <FamilySelect
            familyArray={familyArray}
            onChangeFamily={handleFamilyChange}
          />


          { footExist && familyArray.length > 0 ? (
            /* keyがないとcenterが変わっても位置は変わらない。
              keyがあることで、keyが更新されると別物のコンポーネントだと認識され、
              新しいMapContainerが作成される（centerが反映される） */
             <MapContainer center={center} zoom={zoom} key={center}>
            <TileLayer
              attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* 足あと表示 */}
            <FootPrintMarker
              history={history}
            />
          </MapContainer>
          
          ) : (
            <>
            <p>今日のあしあとがありません</p>
            <MapContainer center={center} zoom={zoom} key={center}>
            <TileLayer
              attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
          </>
          )}
    </HeaderLayout>
   )
}