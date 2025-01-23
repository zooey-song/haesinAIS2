import React, { useState } from "react";
import "./App.css";
import "./index.css";
import Login from "./page/Login";
import Home from "./page/Main";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <BrowserRouter>
        <Routes>
          {/* 기본 경로에서 Login 컴포넌트를 렌더링 */}
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
