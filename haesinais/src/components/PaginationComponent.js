import React from "react";

function PaginationComponent({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-between items-center mt-2">
      <button
        onClick={() => onPageChange("prev")}
        disabled={currentPage === 1}
        className={`px-4 py-1 border rounded ${
          currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
        }`}
      >
        이전
      </button>
      <span>
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange("next")}
        disabled={currentPage === totalPages || totalPages === 0}
        className={`px-4 py-1 border rounded ${
          currentPage === totalPages || totalPages === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
      >
        다음
      </button>
    </div>
  );
}

export default PaginationComponent;
