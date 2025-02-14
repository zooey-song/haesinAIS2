import React, { useRef } from "react";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// CircleWithPopup 컴포넌트: 각 선박 원을 렌더링하며, 클릭 시 popup을 엽니다.
function CircleWithPopup({ location, isSelected, onCircleClick }) {
  const circleRef = useRef(null);

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
          // 타입을 맞추기 위해 Number()를 사용합니다.
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

// 지도 중심 업데이트 컴포넌트
function UpdateCenter({ center }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView([center.lat, center.lng],10);
  }, [center, map]);
  return null;
}

export default MapComponent;
