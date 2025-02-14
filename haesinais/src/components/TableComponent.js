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
  // predictedRoute는 API에서 반환받은 경로 좌표 배열을 저장합니다.
  const [predictedRoute, setPredictedRoute] = useState(null);

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

  // 초기 로드 또는 페이지 변경 시 첫 번째 행 선택
  useEffect(() => {
    if (currentData.length > 0 && !selectedLocation) {
      handleRowClick(currentData[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData, selectedLocation]);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRowClick = (location) => {
    // 테이블 클릭 시 지도 중심 업데이트, 선택된 위치 저장, 예측 경로 초기화
    setMapCenter([location.latitude, location.longitude]);
    setSelectedLocation(location);
    setPredictedRoute(null);
    onRowClick(location);

    // 선택된 행의 MMSI 값을 파라미터로 하여 예측 API 요청
    fetch(`${process.env.REACT_APP_SERVER_IP}/api/predict?mmsi=${location.mmsi}`)
      .then((response) => response.json())
      .then((data) => {
        // API가 아래와 같은 형식의 JSON을 반환한다고 가정합니다.
        // {
        //   "lat_five": 35.0993,
        //   "lon_five": 129.09,
        //   "lat_ten": 35.0768,
        //   "lon_ten": 129.075,
        //   "lat_thirty": 35.0339,
        //   "lon_thirty": 129.055
        // }
        // 반환받은 좌표들을 순서대로 배열로 구성합니다.
        const route = [
          [data.lat_five, data.lon_five],
          [data.lat_ten, data.lon_ten],
          [data.lat_thirty, data.lon_thirty],
        ];
        setPredictedRoute(route);
      })
      .catch((error) => {
        console.error("예측 위치 가져오기 에러:", error);
      });
  };

  return (
    <div className={`${className} flex flex-col`}>
      {/* 검색 입력 필드 */}
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

      {/* 지도 영역 (세로 크기 조정 가능: h-96는 약 24rem) */}
      <div className="mt-4 w-full h-96">
        <MapContainer center={mapCenter} zoom={11} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* 지도 중심 변경용 컴포넌트 */}
          <RecenterMap lat={mapCenter[0]} lng={mapCenter[1]} />
          {/* 선택된 위치 원 (빨간색) */}
          {selectedLocation && (
            <Circle
              center={[selectedLocation.latitude, selectedLocation.longitude]}
              radius={500}
              pathOptions={{ color: "red" }}
            />
          )}
          {/* 예측 경로의 각 지점에 파란색 원 표시 */}
          {predictedRoute &&
            predictedRoute.map((point, index) => (
              <Circle
                key={`predicted-${index}`}
                center={point}
                radius={500}
                pathOptions={{ color: "blue" }}
              />
            ))}
          {/* 선택된 위치와 예측 경로를 순서대로 연결하는 선 (초록색) */}
          {selectedLocation && predictedRoute && (
            <Polyline
              positions={[
                [selectedLocation.latitude, selectedLocation.longitude],
                ...predictedRoute,
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
