import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { IoFootstepsSharp } from "react-icons/io5";
import ReactDOMServer from "react-dom/server";

 const currentIcon = new L.Icon({
    iconUrl: "public/pinicon.png",
    iconSize: [100, 100],
    iconAnchor: [50, 100],
    popupAnchor: [0, -100]
  });

const iconHTML = ReactDOMServer.renderToString(
  <IoFootstepsSharp size={40} />
);

const historyIcon = L.divIcon({
  html: iconHTML,
  className: "",
  iconSize: [40, 40],
 iconAnchor: [20, 40],
});

export const FootPrintMarker = ({history}) => {

  if (!history.length) return null;
  //最新位置
  const latest = history[0];

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
            {h.created_at}
          </Popup>
        </Marker>
      ))}
    </>
  );
};
