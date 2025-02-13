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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get("http://10.125.121.118:8080/api/vessels/lost-count"),
          axios.get("http://10.125.121.118:8080/api/vessels/lost-count2"),
        ]);

        const data1 = response1.data;
        const data2 = response2.data;

        const labels1 = data1.map(item => item.time_range);
        const values1 = data1.map(item => item.count);

        const labels2 = data2.map(item => item.time_range);
        const values2 = data2.map(item => item.count);

        setBarChartData({
          labels: labels1,
          datasets: [
            {
              label: "비탐지된 선박 수",
              data: values1,
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              borderColor: "#3b82f6",
              borderWidth: 1,
            },
          ],
        });

        setPieChartData({
          labels: labels2,
          datasets: [
            {
              data: values2,
              backgroundColor: ["#3b82f6", "#2563eb", "#1d4ed8", "#0f2eab"],
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

  return (
    <div className="w-1/5 h-screen p-4 flex flex-col space-y-8">
      {loading ? (
        <div className="text-center text-lg font-semibold">데이터 로딩 중...</div>
      ) : (
        <>
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">AIS 비탐지 빈도수</h2>
            {barChartData ? <Bar data={barChartData} /> : <p>데이터 없음</p>}
          </div>

          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">AIS 비탐지 비율</h2>
            {pieChartData ? <Doughnut data={pieChartData} /> : <p>데이터 없음</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default Graph;
