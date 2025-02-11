import React from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";

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

        {/* Circle 추가 */}
        {data.map((location) => {
          const isSelected = selectedRow === location.id;
          return (
            <Circle
              key={location.id}
              center={[location.latitude, location.longitude]}
              radius={isSelected ? 15 : 10} // 선택된 원은 약간 더 크기 증가
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
                <strong>Name:</strong> {location.mmsi}
                <br />
                <strong>Longitude:</strong> {location.longitude}
                <br />
                <strong>Latitude:</strong> {location.latitude}
              </Popup>
            </Circle>
          );
        })}

        {/* 지도 중심 업데이트 */}
        <UpdateCenter center={center} />
      </MapContainer>
    </div>
  );
}

function UpdateCenter({ center }) {
  const map = useMap();

  React.useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);

  return null;
}

export default MapComponent;
