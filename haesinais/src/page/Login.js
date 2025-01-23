import React, { useState } from "react";
import Register from "./Register"; // 회원가입 모달 컴포넌트
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const SERVER_IP = process.env.REACT_APP_SERVER_IP;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUserid] = useState(""); // 아이디 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 초기화

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // 에러 초기화

    try {
      const response = await axios.post(`${SERVER_IP}/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        console.log("로그인 성공:", response.data);
        //alert("로그인 성공!");
        navigate("/home"); // homemap 경로로 이동
      }
    } catch (err) {
      console.error("로그인 실패:", err);
      setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative h-screen w-screen bg-gray-900">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('../login_page.png')" }}
      ></div>

      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* 로그인 폼 */}
      <div className="relative flex items-center justify-center h-full">
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8 w-96">
          <h1 className="text-xl font-semibold text-center text-gray-800 mb-6">
            AIS 경로예측
          </h1>
          <form onSubmit={handleLogin}>
            {/* 아이디 입력 */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-2"
              >
                아이디
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUserid(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="아이디를 입력하세요"
              />
            </div>
            {/* 비밀번호 입력 */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              로그인
            </button>
          </form>
          {/* 회원가입 버튼 */}
          <div className="mt-4 text-center">
            {/* 회원가입 모달 */}
            <div>
              <button onClick={openModal}>회원가입</button>
              {isModalOpen && <Register onClose={closeModal} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
