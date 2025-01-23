import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Graph() {
  const [chartData, setChartData] = useState({});
  const [labels] = useState(["30분", "1시간", "1시간 30분", "2시간"]); // x축 레이블

  useEffect(() => {
    // 1. 더미 데이터 생성 (30개, 단위: 분)
    const dummyData = Array.from(
      { length: 30 },
      () => Math.floor(Math.random() * 120) + 1 // 1분 ~ 120분
    );

    // 2. 데이터 분류
    const categories = {
      "30분": 0,
      "1시간": 0,
      "1시간 30분": 0,
      "2시간": 0,
    };

    dummyData.forEach((time) => {
      if (time <= 30) {
        categories["30분"] += 1;
      } else if (time <= 60) {
        categories["1시간"] += 1;
      } else if (time <= 90) {
        categories["1시간 30분"] += 1;
      } else {
        categories["2시간"] += 1;
      }
    });

    // 3. 그래프 데이터 설정
    const data = {
      labels: labels,
      datasets: [
        {
          label: "데이터 개수",
          data: labels.map((label) => categories[label]),
          backgroundColor: "rgba(59, 130, 246, 0.5)", // 막대 색상
          borderColor: "#3b82f6", // 막대 테두리
          borderWidth: 1,
        },
      ],
    };

    setChartData(data);
  }, [labels]);

  const options = {
    indexAxis: "y", // y축을 기준으로 그래프 세로 방향 설정
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "시간 구간별 데이터 개수",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "개수",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1, // x축 눈금 간격을 1로 설정
          precision: 0, // 소수점 제거
        },
      },
      y: {
        title: {
          display: true,
          text: "시간",
        },
      },
    },
  };

  return (
    <div className="w-1/5 h-screen p-4">
      {" "}
      {/* 화면의 1/5 크기 */}
      <h2 className="text-xl font-bold mb-4">세로 그래프</h2>
      {chartData && chartData.datasets ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Graph;
