import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// CircleWithPopup 컴포넌트: 각 선박 원을 렌더링하며, 선택 시 popup을 자동으로 엽니다.
function CircleWithPopup({ location, isSelected, onCircleClick }) {
  const circleRef = useRef(null);

  // isSelected가 true로 변경되면 popup을 열도록 함
  useEffect(() => {
    if (isSelected && circleRef.current) {
      circleRef.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Circle
      ref={circleRef}
      center={[location.latitude, location.longitude]}
      radius={isSelected ? 100 : 10} // 선택 시 원의 크기 확대
      pathOptions={{
        color: isSelected ? "red" : "blue",
        fillColor: isSelected
          ? "rgba(255, 0, 0, 0.5)"
          : "rgba(59, 130, 246, 0.5)",
        fillOpacity: 0.5,
      }}
      eventHandlers={{
        click: () => {
          onCircleClick(location);
          if (circleRef.current) {
            circleRef.current.openPopup();
          }
        },
      }}
    >
      <Popup>
        <strong>ID:</strong> {location.id}
        <br />
        <strong>MMSI:</strong> {location.mmsi}
        <br />
        <strong>경도:</strong> {location.longitude}
        <br />
        <strong>위도:</strong> {location.latitude}
      </Popup>
    </Circle>
  );
}

function UpdateCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], 10);
  }, [center, map]);
  return null;
}

function MapComponent({ data, center, selectedMmsi, onCircleClick }) {
  return (
    <div className="flex-1">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={10}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {data.map((location) => {
          const isSelected = Number(selectedMmsi) === Number(location.mmsi);
          return (
            <CircleWithPopup
              key={`${location.mmsi}-${isSelected ? "selected" : "unselected"}`}
              location={location}
              isSelected={isSelected}
              onCircleClick={onCircleClick}
            />
          );
        })}

        <UpdateCenter center={center} />
      </MapContainer>
    </div>
  );
}

export default MapComponent;
