import React, { useState, useEffect } from "react";
import MapComponent from "../components/MapComponent";
import TableComponent from "../components/TableComponent";
import Graph from "../components/Graph";

function Home() {
  const [data, setData] = useState([]); // 더미 데이터를 저장할 상태
  const [center, setCenter] = useState({ lat: 37.566, lng: 126.978 }); // 초기 중심 좌표
  const [selectedRow, setSelectedRow] = useState(null); // 선택된 행 ID

  // 더미 데이터를 주기적으로 생성하여 상태에 추가
  useEffect(() => {
    const generateDummyData = () => {
      const dummyData = [];
      for (let i = 1; i <= 100; i++) {
        dummyData.push({
          id: i,
          name: `Location ${i}`,
          latitude: 33.0 + Math.random() * 7, // 임의의 위도 (33 ~ 40 사이)
          longitude: 126.0 + Math.random() * 4, // 임의의 경도 (126 ~ 130 사이)
        });
      }
      return dummyData;
    };

    const interval = setInterval(() => {
      console.log("웹소켓으로 데이터를 수신한 것처럼 동작 중...");
      const newData = generateDummyData(); // 새 더미 데이터를 생성
      setData(newData); // 상태 업데이트
    }, 5000); // 5초마다 새로운 데이터 수신

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
  }, []);

  return (
    <div className="h-screen flex">
      {/* Graph 컴포넌트 */}
      <Graph className="w-1/5 h-full" />

      {/* Map 컴포넌트 */}
      <MapComponent
        className="w-3/5 h-full"
        data={data}
        center={center}
        selectedRow={selectedRow}
        onCircleClick={(location) => {
          setCenter({ lat: location.latitude, lng: location.longitude }); // 중심 이동
          setSelectedRow(location.id); // 선택된 행 업데이트
        }}
      />

      {/* Table 컴포넌트 */}
      <TableComponent
        className="w-1/5 h-full"
        data={data}
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
