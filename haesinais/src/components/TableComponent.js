import React, { useState } from "react";

function TableComponent({ className, data, selectedRow, onRowClick }) {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const rowsPerPage = 10; // 한 페이지에 표시할 행 수

  // 페이지 수 계산
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // 현재 페이지의 데이터 가져오기
  const currentData = data.slice(
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
    <div className={`${className} w-1/5 h-full flex flex-col`}>
      {" "}
      {/* 가로 크기: 1/5 */}
      <h2 className="text-lg font-bold mb-2">테이블</h2>
      <table className="w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr>
            <th className="border border-gray-300 px-2 py-1">ID</th>
            <th className="border border-gray-300 px-2 py-1">이름</th>
            <th className="border border-gray-300 px-2 py-1">
              위치 (위도/경도)
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((location) => (
            <tr
              key={location.id}
              className={`cursor-pointer ${
                selectedRow === location.id ? "bg-gray-200" : ""
              }`}
              onClick={() => onRowClick(location)}
            >
              <td className="border border-gray-300 px-2 py-1 text-center">
                {location.id}
              </td>
              <td className="border border-gray-300 px-2 py-1">
                {location.name}
              </td>
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
      {/* 페이징 컨트롤 */}
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
          className={`px-4 py-1 border ${
            currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
          } rounded`}
        >
          이전
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
          className={`px-4 py-1 border ${
            currentPage === totalPages
              ? "bg-gray-300"
              : "bg-blue-500 text-white"
          } rounded`}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default TableComponent;
