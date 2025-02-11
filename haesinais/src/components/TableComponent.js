import React, { useState } from "react";
import PaginationComponent from "./PaginationComponent"; // 페이징 컴포넌트 추가

function TableComponent({ className, data, selectedRow, onRowClick }) {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const rowsPerPage = 10; // 한 페이지에 표시할 행 수

  // 검색 필터 적용 (빈 검색어일 경우 전체 데이터 표시)
  const filteredData =
    searchTerm.trim() === ""
      ? data
      : data.filter((location) =>
          location.mmsi.toString().includes(searchTerm)
        );

  // 페이지 수 계산
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // 현재 페이지의 데이터 가져오기
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // 페이지 변경 함수
  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className={`${className} w-1/3 h-full flex flex-col`}>
      <input
        type="text"
        placeholder="MMSI 검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded w-full"
      />
      <h2 className="text-lg font-bold mb-2">테이블</h2>
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
                selectedRow === location.id ? "bg-gray-200" : "bg-white"
              } hover:bg-gray-100`}
              onClick={() => onRowClick(location)}
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

      {/* 페이징 컴포넌트 사용 */}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default TableComponent;
