import React, { useState, useEffect } from "react";
import axios from "axios"; // 추가
import MapComponent from "../components/MapComponent";
import TableComponent from "../components/TableComponent";
import Graph from "../components/Graph";

function Home() {
  const [AISData, setAISData] = useState([]); // AIS 데이터 상태
  const [center, setCenter] = useState({ lat: 37.566, lng: 126.978 }); // 지도 중심
  const [selectedRow, setSelectedRow] = useState(null); // 선택된 행 ID
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_IP}/api/vessels/all`);

        console.log("API 응답 데이터:", response.data); // API 응답 데이터 구조 확인

        let responseData =
          response.data?.response || response.data?.vessels || [];

        if (Array.isArray(responseData)) {
          const formattedData = responseData
            .filter((item) => item !== null && item !== undefined)
            .map((item) => ({
              msg_type: item.msg_type ?? 0,
              mmsi: item.mmsi ?? 0,
              status: item.status ?? 0,
              turn: item.turn ?? 0,
              speed: item.speed ?? 0,
              accuracy: item.accuracy ?? 0,
              lon: item.lon ?? 0,
              lat: item.lat ?? 0,
              course: item.course ?? 0,
              heading: item.heading ?? 0,
              timestamp: item.timestamp ?? 0,
              datetime: item.datetime ?? 0,
              mmaf_code: item.mmaf_code ?? 0,
              mmaf_name: item.mmaf_name ?? "",
              mmsi_code: item.mmsi_code ?? 0,
              mmsi_name: item.mmsi_name ?? "",
              wind_direct: item.wind_direct ?? 0,
              wind_speed: item.wind_speed ?? 0,
              surface_cur_drc: item.surface_cur_drc ?? 0,
              surface_cur_speed: item.surface_cur_speed ?? 0,
              air_temperature: item.air_temperature ?? 0,
              humidity: item.humidity ?? 0,
              air_pressure: item.air_pressure ?? 0,
              water_temperature: item.water_temperature ?? 0,
              salinity: item.salinity ?? 0,
              latitude: item.latitude ?? 0,
              longitude: item.longitude ?? 0,
            }));

          setAISData(formattedData);
        } else {
          console.error("유효하지 않은 데이터 형식:", responseData);
          setAISData([]); // 데이터가 없을 경우 빈 배열 설정
        }
      } catch (error) {
        console.error("GET 요청 실패:", error);
        setAISData([]); // 요청 실패 시 빈 배열로 초기화
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-screen h-screen flex">
      {/* Graph 컴포넌트 */}
      <Graph className="w-1/3" />

      {/* Map 컴포넌트 */}
      <MapComponent
        className="w-1/3"
        data={AISData} // API 데이터 전달
        center={center}
        selectedRow={selectedRow}
        onCircleClick={(location) => {
          setCenter({ lat: location.latitude, lng: location.longitude }); // 중심 이동
          setSelectedRow(location.id); // 선택된 행 업데이트
        }}
      />

      {/* Table 컴포넌트 */}
      <TableComponent
        className="w-1/3"
        data={AISData} // API 데이터 전달
        selectedRow={selectedRow}
        onRowClick={(location) => {
          setCenter({ lat: location.latitude, lng: location.longitude }); // 중심 이동
          setSelectedRow(location.id); // 선택된 행 업데이트
        }}
      />
    </div>
  );
}

export default Home;
