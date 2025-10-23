// src/components/TodoForm.jsx
import React, { useState } from "react";

function TodoForm({ onTodoAdded }) {
  const [content, setContent] = useState("");

  const handleInputChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("할 일을 입력해주세요!");
      return;
    }

    try {
      // 🚨 이 부분이 핵심 수정 사항입니다!
      // 환경 변수에서 백엔드 API URL을 가져옵니다.
      // Vercel에 설정한 REACT_APP_BACKEND_API_URL과 .env 파일에 설정한 변수명이 일치해야 합니다.
      const backendApiUrl = import.meta.env.VITE_REACT_APP_BACKEND_API_URL;

      if (!backendApiUrl) {
        // 환경 변수가 설정되지 않았을 경우를 대비한 체크
        console.error(
          "환경 변수 REACT_APP_BACKEND_API_URL이 설정되지 않았습니다."
        );
        alert("API 서버 주소를 찾을 수 없습니다. 관리자에게 문의해주세요.");
        return;
      }

      const response = await fetch(
        backendApiUrl, // <--- 백엔드 API URL을 환경 변수로 대체!
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: content, completed: false }),
        }
      );

      if (!response.ok) {
        throw new Error(`할 일 추가 실패! status: ${response.status}`);
      }

      const newTodo = await response.json();
      console.log("새로운 할 일 추가 성공:", newTodo);

      setContent("");

      if (onTodoAdded) {
        onTodoAdded(newTodo);
      }
    } catch (error) {
      console.error("할 일 추가 중 에러 발생:", error);
      alert("할 일 추가 중 문제가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        value={content}
        onChange={handleInputChange}
        placeholder="새로운 할 일을 입력하세요..."
        style={{
          padding: "8px",
          marginRight: "5px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "8px 15px",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "#007bff",
          color: "white",
          cursor: "pointer",
        }}
      >
        추가
      </button>
    </form>
  );
}

export default TodoForm;
