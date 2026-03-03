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
  const navigate = useNavigate();
  const positionRef = useRef(null);

  const [stayStartTime, setStayStartTime] = useState(new Date()); // 自分の滞在開始時刻
  const [stayMinutes, setStayMinutes] = useState(0); // 自分の滞在分
  const [familyMembers, setFamilyMembers] = useState([]); // 家族の位置・滞在データ

  // 移動したのかの判定
  const hasMoved = (p1, p2) => {
    if (!p1 || !p2) return false;
    const threshold = 0.0004; // 約10〜15mの誤差許容
    return (
      Math.abs(p1.latitude - p2.latitude) > threshold ||
      Math.abs(p1.longitude - p2.longitude) > threshold
    );
  };

  // DBから滞在開始時間の取得
  const fetchMyPositionStatus = async () => {
    try {
      const res = await axios.get(`/api/history/${user.id}`);
      const lastData = res.data;
      if (lastData && lastData.stay_start_time) {
        return new Date(lastData.stay_start_time);
      }
    } catch (err) {
      console.error("ステータス取得失敗:", err);
    }
    return new Date();
  };

  // 家族の位置情報取得
  // const fetchFamilyPositions = async () => {
  //   try {
  //     const res = await axios.get(`/api/family-positions/${user.id}`);
  //     setFamilyMembers(res.data);
  //   } catch (err) {
  //     console.error("家族データ取得失敗:", err);
  //   }
  // };

  //現在地DB保存
  const postPosition = async (currentPosition, startTime) => {
    if (!currentPosition) {
      return;
    }
    try {
      const res = await axios.post("/api/home", {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        user,
        stay_start_time: "2026-03-02T21:05:20.333Z",
      });
    } catch (err) {
      console.error(err);
    }
  };

  //現在地取得
  const handleGetPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const result = position.coords;
      if (hasMoved(positionRef.current, result)) {
        setStayStartTime(new Date());
        console.log("移動した！");
      }
      setCurrentPosition(result);
      positionRef.current = result;
    });
  };

  //初回の処理用
  const first = async () => {
    const lastStartTime = await fetchMyPositionStatus();

    navigator.geolocation.getCurrentPosition((position) => {
      const result = position.coords;
      setCurrentPosition(result);
      positionRef.current = result;
      setStayStartTime(lastStartTime);
      const diff = Math.floor((new Date() - lastStartTime) / 60000);
      setStayMinutes(diff);
      postPosition(result);
      // fetchFamilyPositions();
    });
  };

  // 初回、30秒ごとに位置情報取得して保存
  useEffect(() => {
    //初回位置情報取得＆保存
    first();
    //10秒ごと位置情報取得
    // const posInterval = setInterval(handleGetPosition, 10000);
    // //20秒ごと位置情報保存
    // const saveInterval = setInterval(() => {
    //   postPosition(positionRef.current);
    // }, 20000);
    // // 30秒ごとに家族の位置情報取得
    // // const familyInterval = setInterval(fetchFamilyPositions, 30000);
    // // 滞在時間表示用
    // const timerInterval = setInterval(() => {
    //   const diff = Math.floor((new Date() - stayStartTime) / 60000);
    //   setStayMinutes(diff);
    // }, 10000);
    // return () => {
    //   clearInterval(posInterval);
    //   clearInterval(saveInterval);
    //   // clearInterval(familyInterval);
    //   clearInterval(timerInterval);
    // };
  }, []);

  useEffect(() => {
    //初回位置情報取得＆保存
    // first();
    console.log("呼ばれた");
    //10秒ごと位置情報取得
    const posInterval = setInterval(handleGetPosition, 10000);
    //20秒ごと位置情報保存
    const saveInterval = setInterval(() => {
      postPosition(positionRef.current);
      console.log("DB保存!");
    }, 20000);
    // 30秒ごとに家族の位置情報取得
    // const familyInterval = setInterval(fetchFamilyPositions, 30000);
    // 滞在時間表示用
    const timerInterval = setInterval(() => {
      const diff = Math.floor((new Date() - stayStartTime) / 60000);
      setStayMinutes(diff);
      console.log("滞在時間更新!");
    }, 10000);
    return () => {
      clearInterval(posInterval);
      clearInterval(saveInterval);
      // clearInterval(familyInterval);
      clearInterval(timerInterval);
    };
  }, [stayStartTime]);

  if (!currentPosition) {
    return <div>現在地取得中、お待ちください</div>;
  }

  // 初期値の緯度経度
  const position = [currentPosition.latitude, currentPosition.longitude];
  const markerPosition = [currentPosition.latitude, currentPosition.longitude];
  const markerPosition2 = [35.8, 139.61];
  // 初期マップズームレベル
  const zoom = 30;

  return (
    <>
      <h1>地図表記デモ</h1>
      <button onClick={() => navigate("/myPage")}>マイページ</button>
      <p>私の滞在時間：{stayMinutes}</p>
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
