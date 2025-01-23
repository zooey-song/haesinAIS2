import React, { useState } from "react";
import axios from "axios";

const Register = ({ onClose }) => {
  const SERVER_IP = process.env.REACT_APP_SERVER_IP;

  const [username, setUserid] = useState(""); // 아이디 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [success, setSuccess] = useState(""); // 성공 메시지 상태

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // 에러 초기화
    setSuccess(""); // 성공 메시지 초기화

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      console.log("서버 IP:", process.env.REACT_APP_SERVER_IP);
      console.log(process.env);
      // 서버로 회원가입 데이터 전송
      const response = await axios.post(`${SERVER_IP}/members/join`, {
        username,
        password,
      });
      if (response.status === 201) {
        setSuccess("회원가입이 완료되었습니다!");
        setUserid(""); // 입력 필드 초기화
        setPassword("");
        setConfirmPassword("");
        // 서버 응답 데이터 처리
        console.log("회원가입 성공:", response.data);
      }
      setSuccess("회원가입이 완료되었습니다!");
      onClose();
    } catch (err) {
      console.error("회원가입 오류:", err);
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white bg-opacity-90 rounded-lg shadow-lg p-8 w-96">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        <h1 className="text-xl font-semibold text-center text-gray-800 mb-6">
          회원가입
        </h1>
        <form onSubmit={handleRegister}>
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
          {/* 비밀번호 확인 입력 */}
          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-gray-700 font-medium mb-2"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>
          {/* 에러 및 성공 메시지 */}
          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-500 text-sm mb-4 text-center">
              {success}
            </div>
          )}
          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
