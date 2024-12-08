import axios from "../../contexts/api/axios";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletChartMaps() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get("productions/leafletChart/");
      setData(response.data.data);
      console.log("data : ", response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  return (
    <div 
    style={{
      padding: "10px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
    }}>
      <div className="text-center mb-4">
        <h4 style={{ color: "#000 ", fontWeight: "bold" }}>
          Quantités Totales Produites par Région
        </h4>
      </div>
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={2}
        style={{ height: "50vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {data.map((poste, index) => (
          <Circle
            key={index}
            center={[poste.latitude, poste.longitude]}
            radius={poste.production_totale * 100}
            color="#b85555"
            fillColor="#e44e4e"
            fillOpacity={0.4}
          >
            <Popup>
              <strong>Poste : </strong>
              {poste.poste}
              <br />
              <strong>Production : </strong>
              {poste.production_totale}
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}
