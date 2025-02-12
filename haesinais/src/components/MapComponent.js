import React from "react";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapComponent({ data, center, selectedRow, onCircleClick }) {
  return (
    <div className="flex-1">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={7}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* 원 추가 (AIS 데이터) */}
        {data.map((location) => {
          const isSelected = selectedRow === location.id;
          return (
            <Circle
              key={location.id}
              center={[location.latitude, location.longitude]}
              radius={isSelected ? 100 : 10} // 선택된 원 확대
              pathOptions={{
                color: isSelected ? "red" : "blue",
                fillColor: isSelected ? "rgba(255, 0, 0, 0.5)" : "rgba(59, 130, 246, 0.5)",
                fillOpacity: 0.5,
              }}
              eventHandlers={{
                click: () => onCircleClick(location),
              }}
            >
              <Popup>
                <strong>ID:</strong> {location.id}
                <br />
                <strong>MMSI:</strong> {location.mmsi}
                <br />
                <strong>Longitude:</strong> {location.longitude}
                <br />
                <strong>Latitude:</strong> {location.latitude}
              </Popup>
            </Circle>
          );
        })}

        {/* 지도 중심 & 줌 조정 */}
        <UpdateCenter center={center} />
      </MapContainer>
    </div>
  );
}

// 지도 중심 & 줌 동적 업데이트
function UpdateCenter({ center }) {
  const map = useMap();

  React.useEffect(() => {
    map.setView([center.lat, center.lng], 13); // 지도 중심 이동 & 줌 10 레벨
  }, [center, map]);

  return null;
}

export default MapComponent;
