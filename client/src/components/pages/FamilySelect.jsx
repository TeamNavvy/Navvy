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

import { use } from "react";


export const FamilySelect = ({familyArray, onChangeFamily}) => {
  // セッションのユーザー情報の取得
  const { user, setUser } = useUser();

  console.log("FamilySelect",familyArray);
  

   return (
    <>
    <h3>表示ユーザ選択</h3>
  
     <select onChange={(e) => onChangeFamily(e.target.value)}>
      {familyArray.map((family) => {
        return (
          <option key={family.id} value={family.id}>
            {family.name}
          </option>
        );
      })}
    </select>
      
    </>
   )
}