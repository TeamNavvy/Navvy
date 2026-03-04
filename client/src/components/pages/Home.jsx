import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Tooltip,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "../../map.css";
import L from "leaflet";
import { useState, useEffect, useRef } from "react";
// L.Icon.Default.imagePath =
//   "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/";
import axios from "axios";
//グローバルステート用
import { useUser } from "../UserContext";

// Popup 内専用コンポーネント（useMap が使えるようにする）
const PopupContent = ({
  status,
  setStatus,
  comment,
  setComment,
  saveStatus,
}) => {
  const map = useMap();

  const handleSave = async () => {
    await saveStatus();
    map.closePopup(); // ← 保存後にPopupを閉じる
  };

  return (
    <div style={{ width: "200px" }}>
      <div>
        <strong>Status</strong>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            width: "100%",
            marginTop: "5px",
            padding: "5px",
            fontSize: "18px",
          }}
        >
          <option value="🏠">🏠</option>
          <option value="🏫">🏫</option>
          <option value="🏃‍♀️">🏃‍♀️</option>
          <option value="🛝">🛝</option>
          <option value="✍🏻">✍🏻</option>
          <option value="💰">💰</option>
          <option value="🧓🧑‍🦳">🧓🧑‍🦳</option>
        </select>
      </div>

      <div style={{ marginTop: "10px" }}>
        <strong>Comment</strong>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          style={{ width: "100%", marginTop: "5px" }}
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "5px",
          background: "#4caf50",
          color: "white",
          borderRadius: "5px",
        }}
      >
        保存
      </button>
    </div>
  );
};

export const Home = () => {
  // user_status管理
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

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
    // console.log("ログインユーザ情報：", user);
    // console.log("currentPosition:", currentPosition);
    try {
      const res = await axios.post("/api/home", {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        user,
      });
      // console.log("位置保存成功");
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

      // console.log("現在地取得");
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

  // user_status取得
  const fetchStatus = async () => {
    try {
      const res = await axios.get(`/api/status/${user.id}`);
      if (res.data) {
        setStatus(res.data.status || "");
        setComment(res.data.comment || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 初回、30秒ごとに位置情報取得して保存
  useEffect(() => {
    //初回位置情報取得＆保存
    first();
    //statusも読み込む
    fetchStatus();

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
  // const markerPosition2 = [35.8, 139.61];
  // 初期マップズームレベル
  const zoom = 30;

  // useEffect(() => {
  //   fetch(`/api`)
  //     .then((res) => res.json())
  //     .then((data) => console.log(data, "******"));
  // }, []);

  // // user_status管理
  // const [status, setStatus] = useState("");
  // const [comment, setComment] = useState("");
  // const [loading, setLoading] = useState(true);

  // 保存処理
  const saveStatus = async () => {
    try {
      await axios.post("/api/status", {
        userId: user.id,
        status,
        comment,
      });
    } catch (err) {
      console.error(err);
      alert("保存に失敗しました");
    }
  };

  const pinWithEmoji = L.divIcon({
    html: `
    <div style="
      display: flex;
      align-items: center;
    ">
      <img
        src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png"
        style="width: 25px; height: 41px;"
      />
      <span style="font-size: 22px; margin-left: 4px;">
        ${status}
      </span>
    </div>
  `,
    className: "",
    iconSize: null,
    iconAnchor: [12, 41], // ← ピンの先端をmarkerPositionに完全固定25×41のため
  });

  return (
    <>
      <h1>地図表記デモ</h1>
      <button onClick={() => navigate("/myPage")}>マイページ</button>
      <MapContainer center={position} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={markerPosition}
          icon={pinWithEmoji}
          eventHandlers={{
            click: () => {
              setLoading(true);
              fetchStatus();
            },
          }}
        >
          <Tooltip permanent direction="top" offset={[0, -45]}>
            {comment}
          </Tooltip>
          <Popup>
            {loading ? (
              <div>読み込み中...</div>
            ) : (
              <PopupContent
                status={status}
                setStatus={setStatus}
                comment={comment}
                setComment={setComment}
                saveStatus={saveStatus}
              />
            )}
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
};
