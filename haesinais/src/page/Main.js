import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MapComponent from "../components/MapComponent";
import TableComponent from "../components/TableComponent";
import Graph from "../components/Graph";
import Spinner from "../components/Spinner";

function Home() {
  const [mapData, setMapData] = useState([]); // 모든 선박 데이터
  const [tableData, setTableData] = useState([]); // 조건에 맞는 선박 데이터
  const [center, setCenter] = useState({ lat: 35.1379222, lng: 129.05562775 });
  const [selectedMmsi, setSelectedMmsi] = useState(null); // 선택된 선박의 MMSI
  const [loading, setLoading] = useState(true);

  // API 응답 데이터 포맷에 따른 데이터 추출 함수
  const extractResponseData = (data) => {
    let responseData = [];
    if (Array.isArray(data)) {
      responseData = data;
    } else if (Array.isArray(data?.response)) {
      responseData = data.response;
    } else if (Array.isArray(data?.vessels)) {
      responseData = data.vessels;
    } else {
      console.error("예상하지 못한 데이터 형식:", data);
    }
    if (!Array.isArray(responseData)) {
      responseData = [];
    }
    return responseData;
  };

  const fetchData = useCallback(async () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    try {
      const [allResponse, shipsAboveResponse] = await Promise.all([
        axios.get(`${SERVER_IP}/api/vessels/all`),
        axios.get(`${SERVER_IP}/api/vessels/ships-above-60`)
      ]);

      const allData = extractResponseData(allResponse.data);
      const shipsAboveData = extractResponseData(shipsAboveResponse.data);

      const formatData = (dataArray) => {
        return dataArray
          .filter((item) => item != null)
          .map((item) => ({
            id: item.id ?? 0,
            mmsi: item.mmsi ?? 0,
            latitude: item.latitude ?? item.lat ?? 0,
            longitude: item.longitude ?? item.lon ?? 0,
          }));
      };

      setMapData(formatData(allData));
      setTableData(formatData(shipsAboveData));
    } catch (error) {
      console.error("GET 요청 실패:", error.message);
      setMapData([]);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      console.log("1분마다 데이터 갱신 중...");
      fetchData();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex m-5">
      <>
        {/* Graph 컴포넌트 */}
        <Graph className="w-1/3" />

        {/* Map 컴포넌트: 모든 선박 데이터를 사용 */}
        <MapComponent
          className="w-1/3"
          data={mapData}
          center={center}
          selectedMmsi={selectedMmsi}
          onCircleClick={(location) => {
            setCenter({ lat: location.latitude, lng: location.longitude });
            setSelectedMmsi(location.mmsi);  // 선택된 선박의 MMSI 업데이트
          }}
        />

        {/* Table 컴포넌트: 조건에 맞는 선박 데이터를 사용 */}
        <TableComponent
          className="w-1/3"
          data={tableData}
          selectedMmsi={selectedMmsi}
          onRowClick={(location) => {
            setCenter({ lat: location.latitude, lng: location.longitude });
            setSelectedMmsi(location.mmsi);  // 선택된 선박의 MMSI 업데이트
          }}
        />
      </>
    </div>
  );
}

export default Home;
