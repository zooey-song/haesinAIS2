import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MapComponent from "../components/MapComponent";
import TableComponent from "../components/TableComponent";
import Graph from "../components/Graph";

function Home() {
  const [AISData, setAISData] = useState([]); // AIS 데이터 상태
  const [center, setCenter] = useState({ lat: 37.566, lng: 126.978 }); // 지도 중심
  const [selectedRow, setSelectedRow] = useState(null); // 선택된 행 ID
  const [loading, setLoading] = useState(true); // 로딩 상태

  // ✅ 데이터를 가져오는 함수
  const fetchData = useCallback(async () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    console.log("서버 IP:", SERVER_IP);

    try {
      const response = await axios.get(`${SERVER_IP}/api/vessels/all`);
      console.log("API 응답 데이터:", response.data);

      let responseData = [];

      if (Array.isArray(response.data)) {
        responseData = response.data;
      } else if (Array.isArray(response.data?.response)) {
        responseData = response.data.response;
      } else if (Array.isArray(response.data?.vessels)) {
        responseData = response.data.vessels;
      } else {
        console.error("예상하지 못한 데이터 형식:", response.data);
      }

      if (!Array.isArray(responseData)) {
        console.error("responseData가 배열이 아닙니다:", responseData);
        responseData = [];
      }

      console.log("최종 responseData:", responseData);

      const formattedData = responseData
        .filter((item) => item !== null && item !== undefined)
        .map((item) => ({
          id: item.id ?? 0,
          lost: item.lost ?? 0,
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

      console.log("페이징 전", formattedData);
      setAISData(formattedData);
    } catch (error) {
      console.error("GET 요청 실패:", error.message);
      if (error.response) {
        console.error("서버 응답 데이터:", error.response.data);
        console.error("서버 응답 상태 코드:", error.response.status);
      }
      setAISData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ 컴포넌트 마운트 시 데이터 가져오기 + 1분마다 자동 갱신
  useEffect(() => {
    fetchData(); // 최초 실행

    const interval = setInterval(() => {
      console.log("1분마다 데이터 갱신 중...");
      fetchData(); // 1분마다 실행
    }, 60000); // 60000ms = 60초

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, [fetchData]);

  return (
    <div className="w-screen h-screen flex m-5">
      <>
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
      </>
    </div>
  );
}

export default Home;
