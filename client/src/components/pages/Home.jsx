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
  // user_status管理
  const [emotion, setEmotion] = useState("😃");
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
  // const markerPosition2 = [35.8, 139.61];
  // 初期マップズームレベル
  const zoom = 30;

  // useEffect(() => {
  //   fetch(`/api`)
  //     .then((res) => res.json())
  //     .then((data) => console.log(data, "******"));
  // }, []);

  // // user_status管理
  // const [emotion, setEmotion] = useState("");
  // const [comment, setComment] = useState("");
  // const [loading, setLoading] = useState(true);

  // user_status取得
  const fetchStatus = async () => {
    try {
      const res = await axios.get(`/api/status/${user.id}`);
      if (res.data) {
        setEmotion(res.data.emotion || "😃");
        setComment(res.data.comment || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 保存処理
  const saveStatus = async () => {
    try {
      await axios.post("/api/status", {
        userId: user.id,
        emotion,
        comment,
      });
      alert("保存しました！");
    } catch (err) {
      console.error(err);
      alert("保存に失敗しました");
    }
  };

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
          eventHandlers={{
            click: () => {
              setLoading(true);
              fetchStatus();
            },
          }}
        >
          <Popup>
            {loading ? (
              <div>読み込み中...</div>
            ) : (
              <div style={{ width: "200px" }}>
                <div>
                  <strong>feeling</strong>
                  <div
                    style={{ display: "flex", gap: "8px", marginTop: "5px" }}
                  >
                    {["😃", "🙂", "😐", "😢", "😡", "👹"].map((e) => (
                      <button
                        key={e}
                        onClick={() => setEmotion(e)}
                        style={{
                          fontSize: "20px",
                          background: emotion === e ? "#ddd" : "white",
                          borderRadius: "5px",
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <strong>comment</strong>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    style={{ width: "100%", marginTop: "5px" }}
                  />
                </div>

                <button
                  onClick={saveStatus}
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
            )}
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
};
