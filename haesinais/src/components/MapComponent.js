import React from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";

function MapComponent({ data, center, selectedRow, onCircleClick }) {
  return (
    <div className="flex-1">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Circle 추가 */}
        {data.map((location) => (
          <Circle
            key={location.id}
            center={[location.latitude, location.longitude]}
            radius={10} // 반경 10m
            pathOptions={{
              color: selectedRow === location.id ? "red" : "blue",
              fillColor:
                selectedRow === location.id
                  ? "rgba(255, 0, 0, 0.5)"
                  : "rgba(59, 130, 246, 0.5)",
              fillOpacity: 0.5,
            }}
            eventHandlers={{
              click: () => onCircleClick(location), // Circle 클릭 시 호출
            }}
          >
            <Popup>
              <strong>ID:</strong> {location.id}
              <br />
              <strong>Name:</strong> {location.name}
              <br />
              <strong>Longitude:</strong> {location.longitude}
              <br />
              <strong>Latitude:</strong> {location.latitude}
            </Popup>
          </Circle>
        ))}

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
