import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { IoFootstepsSharp } from "react-icons/io5";
import ReactDOMServer from "react-dom/server";
import { useEffect, useState } from "react";
import axios from "axios";
import "./FootPrintMarker.css";


  const iconHTML = ReactDOMServer.renderToString(
  <IoFootstepsSharp size={40}  />
);

//足あとアイコン用
const historyIcon = L.divIcon({
  html: iconHTML,
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export const FootPrintMarker = ({history}) => {

  const [currentIcon, setCurrentIcon] = useState(new L.Icon({
          iconUrl: "/pinicon.png",
          iconSize: [100, 100],
          iconAnchor: [50, 100],
          popupAnchor: [0, -100]
        }));

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tokyo"
    });
  };

  //ユーザアイコンURL取得
  const getIconURL = async () => {
    try {
      const res = await axios.get(`/api/icon/${history[0].user_id}`);
      console.log(res.data);
      if (res.data.image_url) {
        const icon = new L.Icon({
          iconUrl: res.data.image_url,
          iconSize: [50, 50],
          iconAnchor: [25, 50],
          popupAnchor: [0, -50],
          className: 'round-icon'
        });
        setCurrentIcon(icon);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!history.length) return null;

  //最新位置
  const latest = history[0];

  useEffect(() => {
     if (history.length > 0) {
      getIconURL();
     }
  }, [history]);

  return (
    <>
     {/* 最新位置 */}
      <Marker
        position={[latest.latitude, latest.longitude]}
        icon={currentIcon}
      >
        <Popup>現在地</Popup>
      </Marker>

      {/* 履歴 */}
      {history.slice(1).map((h) => (
        <Marker
          key={h.id}
          position={[h.latitude, h.longitude]}
          icon={historyIcon}
        >
          <Popup>
            {formatTime(h.created_at)}
          </Popup>
        </Marker>
      ))}
    </>
  );
};
