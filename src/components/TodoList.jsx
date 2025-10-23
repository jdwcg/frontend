// src/components/TodoList.jsx (전체 코드)
import React, { useEffect, useState } from "react";

// props로 refreshKey와 onListChanged 함수를 받습니다.
function TodoList({ refreshKey, onListChanged }) {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트가 처음 마운트되거나 refreshKey가 변할 때마다 백엔드 API에서 할 일 목록을 가져옵니다.
  useEffect(() => {
    setLoading(true); // 데이터를 다시 불러올 때 로딩 상태로 설정
    // 백엔드 API로부터 할 일 목록을 가져오는 fetch 요청
    fetch("https://backend-javaspring-yi7s.onrender.com/api/todos")
      .then((response) => {
        if (!response.ok) {
          // HTTP 응답 코드가 200 OK가 아니면 에러 처리
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // 응답 본문을 JSON 형태로 파싱
      })
      .then((data) => {
        setTodos(data); // 가져온 데이터를 todos 상태에 저장
        setLoading(false); // 로딩 완료
        setError(null); // 에러 상태 초기화
      })
      .catch((error) => {
        // 요청 실패 시 에러 처리
        console.error("할 일을 가져오는 중 에러 발생:", error);
        setError(
          "할 일을 가져오지 못했습니다. 서버가 실행 중인지 확인해주세요."
        );
        setLoading(false); // 로딩 완료
      });
  }, [refreshKey]); // refreshKey가 변할 때마다 이 useEffect가 다시 실행됩니다!

  // 할 일의 완료 상태를 토글하는 함수 (체크박스 클릭 시 호출)
  const handleToggleCompleted = async (id, currentCompletedStatus) => {
    try {
      // 백엔드 API에 PUT 요청을 보냅니다.
      const response = await fetch(
        `https://backend-javaspring-yi7s.onrender.com/api/todos/${id}`,
        {
          method: "PUT", // PUT 메서드 사용
          headers: {
            "Content-Type": "application/json",
          },
          // 현재 상태의 반대 (true -> false, false -> true)로 completed 상태를 업데이트
          body: JSON.stringify({ completed: !currentCompletedStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`할 일 상태 업데이트 실패! status: ${response.status}`);
      }

      // 상태 업데이트 성공 시, 부모 컴포넌트에 알림 (리스트 새로고침을 위함)
      if (onListChanged) {
        onListChanged();
      }
    } catch (error) {
      console.error(`할 일 (ID: ${id}) 상태 업데이트 중 에러 발생:`, error);
      alert("할 일 상태 업데이트 중 문제가 발생했습니다.");
    }
  };

  // 할 일을 삭제하는 함수 (삭제 버튼 클릭 시 호출)
  const handleDeleteTodo = async (id) => {
    if (!window.confirm("정말 이 할 일을 삭제하시겠습니까?")) {
      return; // 사용자가 취소하면 삭제하지 않음
    }
    try {
      // 백엔드 API에 DELETE 요청을 보냅니다.
      const response = await fetch(
        `https://backend-javaspring-yi7s.onrender.com/api/todos/${id}`,
        {
          method: "DELETE", // DELETE 메서드 사용
        }
      );

      // DELETE 요청은 보통 204 No Content 또는 200 OK를 반환합니다.
      // 내용이 없더라도 응답이 성공적인지 확인합니다.
      if (!response.ok) {
        throw new Error(`할 일 삭제 실패! status: ${response.status}`);
      }

      // 삭제 성공 시, 부모 컴포넌트에 알림 (리스트 새로고침을 위함)
      if (onListChanged) {
        onListChanged();
      }
    } catch (error) {
      console.error(`할 일 (ID: ${id}) 삭제 중 에러 발생:`, error);
      alert("할 일 삭제 중 문제가 발생했습니다.");
    }
  };

  if (loading) {
    return <p>할 일 목록 불러오는 중... 🏃‍♀️</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>에러: {error}</p>;
  }

  return (
    <div>
      <h2>나의 할 일들</h2>
      {todos.length === 0 ? (
        <p>아직 할 일이 없어요! 🤔</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? "completed" : ""}>
              {/* 체크박스 */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleCompleted(todo.id, todo.completed)}
                style={{ marginRight: "10px" }}
              />
              <span>{todo.content}</span>
              {/* 삭제 버튼 추가 */}
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                style={{
                  marginLeft: "15px",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#dc3545", // 빨간색 버튼
                  color: "white",
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
