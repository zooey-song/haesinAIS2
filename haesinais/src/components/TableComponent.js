import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Circle, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PaginationComponent from "./PaginationComponent"; // 페이징 컴포넌트

// 지도 재중심화 컴포넌트
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

function TableComponent({ className, data, selectedMmsi, onRowClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;
  const [mapCenter, setMapCenter] = useState([37.566, 126.978]); // 기본 서울 좌표
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [predictedLocation, setPredictedLocation] = useState(null);

  // 검색어에 따라 데이터 필터링
  const trimmedSearchTerm = searchTerm.trim();

  const filteredData =
    trimmedSearchTerm === ""
      ? data
      : data.filter((location) =>
          location.mmsi.toString().includes(trimmedSearchTerm)
        );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // 초기 로드 시 또는 페이지 변경 시 첫번째 row 선택
  useEffect(() => {
    if (currentData.length > 0 && !selectedLocation) {
      handleRowClick(currentData[0]);
    }
  }, [currentData, selectedLocation]);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRowClick = (location) => {
    // 테이블 클릭 시 지도 중심 좌표 업데이트
    setMapCenter([location.latitude, location.longitude]);
    setSelectedLocation(location);
    setPredictedLocation(null); // 새로운 row 선택 시 예측값 초기화
    // mmsi 값을 부모 컴포넌트로 전달
    onRowClick(location);

    // 선택된 row의 MMSI로 예측 API 요청
    fetch(`/api/predict?mmsi=${location.mmsi}`)
      .then((response) => response.json())
      .then((data) => {
        // API가 { latitude, longitude } 형태의 예측 데이터를 반환한다고 가정합니다.
        setPredictedLocation(data);
      })
      .catch((error) => {
        console.error("예측 위치 가져오기 에러:", error);
      });
  };

  return (
    <div className={`${className} flex flex-col`}>
      {/* 검색 인풋 */}
      <input
        type="text"
        placeholder="MMSI 검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded w-full"
      />

      {/* 테이블 영역 */}
      <h2 className="text-lg font-bold mb-2">소실 선박 정보</h2>
      <table className="w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-1">ID</th>
            <th className="border border-gray-300 px-2 py-1">MMSI</th>
            <th className="border border-gray-300 px-2 py-1">위치 (위도/경도)</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((location) => (
            <tr
              key={location.id}
              className={`cursor-pointer ${
                selectedMmsi === location.mmsi ? "bg-gray-200" : "bg-white"
              } hover:bg-gray-100`}
              onClick={() => handleRowClick(location)}
            >
              <td className="border border-gray-300 px-2 py-1 text-center">
                {location.id}
              </td>
              <td className="border border-gray-300 px-2 py-1">{location.mmsi}</td>
              <td className="border border-gray-300 px-2 py-1">
                <div className="flex flex-col">
                  <span>위도: {location.latitude.toFixed(6)}</span>
                  <span>경도: {location.longitude.toFixed(6)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* 지도 영역 (세로 크기 확장: h-96 는 약 24rem, 필요에 따라 조정) */}
      <div className="mt-4 w-full h-96">
        <MapContainer center={mapCenter} zoom={10} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* 지도 중심 변경용 컴포넌트 */}
          <RecenterMap lat={mapCenter[0]} lng={mapCenter[1]} />
          {/* 기본 위치 원 (빨간색) */}
          {selectedLocation && (
            <Circle
              center={[selectedLocation.latitude, selectedLocation.longitude]}
              radius={500}
              pathOptions={{ color: "red" }}
            />
          )}
          {/* 예측 위치 원 (파란색) */}
          {predictedLocation && (
            <Circle
              center={[predictedLocation.latitude, predictedLocation.longitude]}
              radius={500}
              pathOptions={{ color: "blue" }}
            />
          )}
          {/* 기본 위치와 예측 위치를 연결하는 선 (초록색) */}
          {selectedLocation && predictedLocation && (
            <Polyline
              positions={[
                [selectedLocation.latitude, selectedLocation.longitude],
                [predictedLocation.latitude, predictedLocation.longitude],
              ]}
              pathOptions={{ color: "green" }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default TableComponent;
