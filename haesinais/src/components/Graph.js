import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Graph() {
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const labels = ["5~10분", "10~60분", "60~120분", "120~180분", "180분 이상"]; // 시간 구간

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ API 호출
        const response = await axios.get("http://10.125.121.118:8080/api/vessels/lost-interval-counts");

        const fetchedData = response.data; // 서버에서 가져온 JSON 데이터

        // ✅ 데이터 매핑
        const categories = {
          "5~10분": fetchedData["count_5_10"] || 0,
          "10~60분": fetchedData["count_10_60"] || 0,
          "60~120분": fetchedData["count_60_120"] || 0,
          "120~180분": fetchedData["count_120_180"] || 0,
          "180분 이상": fetchedData["count_180_plus"] || 0,
        };

        const datasetValues = labels.map((label) => categories[label]);

        // ✅ 막대 그래프 데이터
        setBarChartData({
          labels: labels,
          datasets: [
            {
              label: "비탐지된 선박 수",
              data: datasetValues,
              backgroundColor: "rgba(59, 130, 246, 0.5)", // 파란색 (연한)
              borderColor: "#3b82f6", // 파란색 (진한)
              borderWidth: 1,
            },
          ],
        });

        // ✅ 원형 그래프 데이터
        setPieChartData({
          labels: labels,
          datasets: [
            {
              data: datasetValues,
              backgroundColor: [
                "rgba(59, 130, 246, 0.5)", // 연한 파란색
                "rgba(37, 99, 235, 0.5)", // 진한 파란색
                "rgba(29, 78, 216, 0.5)", // 더 진한 파란색
                "rgba(15, 46, 171, 0.5)", // 가장 진한 파란색
                "rgba(0, 30, 140, 0.5)", // 가장 어두운 파란색
              ],
              borderColor: ["#3b82f6", "#2563eb", "#1d4ed8", "#0f2eab", "#001e8c"],
              borderWidth: 1,
            },
          ],
        });

      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "AIS 소실된 시간 구간별 선박 수",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: "시간 구간",
        },
      },
    },
  };

  return (
    <div className="w-1/5 h-screen p-4 flex flex-col space-y-8">
      {loading ? (
        <div className="text-center text-lg font-semibold">데이터 로딩 중...</div>
      ) : (
        <>
          {/* ✅ 세로 막대 그래프 */}
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">해당 선박 AIS 비탐지 빈도수</h2>
            {barChartData ? <Bar data={barChartData} options={options} /> : <p>데이터 없음</p>}
          </div>

          {/* ✅ 원형 그래프 */}
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">전체 AIS 중 비탐지되는 빈도수</h2>
            {pieChartData ? <Doughnut data={pieChartData} /> : <p>데이터 없음</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default Graph;
