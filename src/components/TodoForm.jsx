// src/components/TodoForm.jsx
import React, { useState } from "react";

function TodoForm({ onTodoAdded }) {
  // 부모 컴포넌트로부터 '할 일이 추가되면 호출될 함수'를 받습니다.
  const [content, setContent] = useState(""); // 입력 필드의 내용을 저장할 상태 변수

  // 입력 필드에 값이 변경될 때마다 content 상태를 업데이트합니다.
  const handleInputChange = (e) => {
    setContent(e.target.value);
  };

  // 폼 제출 시 호출될 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작(페이지 새로고침)을 막습니다.

    // 입력 내용이 비어있다면 추가하지 않습니다.
    if (!content.trim()) {
      alert("할 일을 입력해주세요!");
      return;
    }

    try {
      // 백엔드 API에 POST 요청을 보냅니다.
      const response = await fetch(
        "https://backend-javaspring-yi7s.onrender.com/api/todos",
        {
          method: "POST", // POST 메서드 사용
          headers: {
            "Content-Type": "application/json", // JSON 형식으로 데이터를 보낸다고 명시
          },
          // JavaScript 객체를 JSON 문자열로 변환하여 요청 본문에 넣습니다.
          body: JSON.stringify({ content: content, completed: false }),
        }
      );

      if (!response.ok) {
        // HTTP 응답 코드가 200 OK가 아니면 에러 처리
        throw new Error(`할 일 추가 실패! status: ${response.status}`);
      }

      // 할 일 추가 성공!
      const newTodo = await response.json(); // 백엔드에서 응답으로 보내준 새로운 할 일 데이터를 받습니다.
      console.log("새로운 할 일 추가 성공:", newTodo);

      setContent(""); // 입력 필드를 비웁니다.

      // 부모 컴포넌트에 할 일이 추가되었음을 알립니다. (TodoList를 새로고침하기 위함)
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
