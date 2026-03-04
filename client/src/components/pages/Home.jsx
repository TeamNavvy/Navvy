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
import { HeaderLayout } from "../templates/HeaderLayout";

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
  //ログインユーザのアイコンURL
  const [myIconURL, setmyIconURL] = useState("");
  const navigate = useNavigate();
  const positionRef = useRef(null);

  const [stayStartTime, setStayStartTime] = useState(); // 自分の滞在開始時刻
  const [stayMinutes, setStayMinutes] = useState(0); // 自分の滞在分
  const [familyMembers, setFamilyMembers] = useState([]); // 家族の位置・滞在データ

  // 移動したのかの判定
  const hasMoved = (p1, p2) => {
    if (!p1 || !p2) return false;
    const threshold = 0.0004; // 誤差許容
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
  const fetchFamilyPositions = async () => {
    try {
      const res = await axios.get(`/api/family-positions/${user.id}`);
      setFamilyMembers(res.data);
    } catch (err) {
      console.error("家族データ取得失敗:", err);
    }
  };

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
        stay_start_time: startTime,
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
      //画面表示用処理
      const diff = Math.floor((new Date() - lastStartTime) / 60000);
      setStayMinutes(diff);

      postPosition(result, lastStartTime);
      fetchFamilyPositions();
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

  //ログインユーザアイコンURL取得
  const getMyIconURL = async () => {
    try {
      const res = await axios.get(`/api/icon/${user.id}`);
      console.log(res.data.image_url);
      if (res.data) {
        setmyIconURL(res.data.image_url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 初回、30秒ごとに位置情報取得して保存
  useEffect(() => {
    //初回位置情報取得＆保存
    first();
    //statusも読み込む
    fetchStatus();
    getMyIconURL(user.id);
  }, []);

  useEffect(() => {
    //10秒ごと位置情報取得
    const posInterval = setInterval(handleGetPosition, 10000);
    //20秒ごと位置情報保存
    const saveInterval = setInterval(() => {
      postPosition(positionRef.current, stayStartTime);
    }, 20000);
    // 30秒ごとに家族の位置情報取得
    const familyInterval = setInterval(fetchFamilyPositions, 30000);
    // 滞在時間表示用
    const timerInterval = setInterval(() => {
      const diff = Math.floor((new Date() - stayStartTime) / 60000);
      setStayMinutes(diff);
    }, 10000);
    return () => {
      clearInterval(posInterval);
      clearInterval(saveInterval);
      clearInterval(familyInterval);
      clearInterval(timerInterval);
    };
  }, [stayStartTime]);

  if (!currentPosition) {
    return <div>現在地取得中、お待ちください</div>;
  }

  // 初期値の緯度経度
  const position = [currentPosition.latitude, currentPosition.longitude];
  const markerPosition = [currentPosition.latitude, currentPosition.longitude];
  // const markerPosition2 = [35.8, 139.61];
  // 初期マップズームレベル
  const zoom = 30;
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
        src="${myIconURL}"
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
    <HeaderLayout>
      <h1>現在地ビュー</h1>
      <p>私の滞在時間：{stayMinutes}</p>
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
    </HeaderLayout>
  );
};
