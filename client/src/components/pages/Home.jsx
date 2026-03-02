import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "../../map.css";
import L from "leaflet";
import { useState, useEffect, useRef } from "react";
L.Icon.Default.imagePath =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/";
import axios from "axios";
//グローバルステート用
import { useUser } from "../UserContext";

export const Home = () => {
  //user情報(グローバルステート)
  const { user, setUser } = useUser();
  //現在地用
  const [currentPosition, setCurrentPosition] = useState();
  let navigate = useNavigate();
  const positionRef = useRef(null);

  //現在地DB保存
  const postPosition = async (currentPosition) => {
    if (!currentPosition) {
      console.log("ここcurrentPosition:", currentPosition);
      return;
    }
    console.log("ログインユーザ情報：", user);
    console.log("currentPosition:", currentPosition);
    try {
      const res = await axios.post("/api/home", {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        user,
      });
      console.log("位置保存成功");
    } catch (err) {
      console.error(err);
      console.log("現在地が保存できません");
    }
  };

  //現在地取得  let navigate = useNavigate();

  const handleGetPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const result = position.coords;
      setCurrentPosition(result);
      positionRef.current = result;

      console.log("現在地取得");
    });
  };

  //初回の処理用
  const first = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const result = position.coords;
      setCurrentPosition(result);

      console.log("初回 現在地取得");

      postPosition(result);
    });
  };

  // 初回、30秒ごとに位置情報取得して保存
  useEffect(() => {
    //初回位置情報取得＆保存
    first();

    //10秒ごと位置情報取得
    setInterval(handleGetPosition, 10000);
    //20秒ごと位置情報保存
    setInterval(() => {
      postPosition(positionRef.current);
    }, 20000);
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
      <button onClick={() => navigate("/myPage")}>マイページ</button>
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
