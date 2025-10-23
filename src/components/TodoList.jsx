// src/components/TodoList.jsx (전체 코드)
import React, { useEffect, useState } from "react";

// props로 refreshKey와 onListChanged 함수를 받습니다.
function TodoList({ refreshKey, onListChanged }) {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 환경 변수에서 백엔드 API URL을 가져옵니다.
  // 이 상수는 함수 컴포넌트 내부 또는 외부에 선언할 수 있습니다.
  // 여기서는 여러 함수에서 사용되므로, 렌더링마다 생성되지 않도록 컴포넌트 외부에 선언하는 것도 좋습니다.
  const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;

  // 환경 변수가 설정되지 않았을 경우를 대비한 체크
  // 이 부분은 컴포넌트가 마운트될 때 한 번만 수행되도록 useEffect 밖에서 상수로 선언하는 것이 더 적절합니다.
  if (!backendApiUrl && !loading) {
    // 로딩 중이 아닐 때만 에러 메시지를 표시하도록 조건 추가
    // 단, 이 방식은 렌더링 과정에서 경고를 발생시킬 수 있으니, useEffect 내부에서 관리하는 것이 더 안전합니다.
  }

  useEffect(() => {
    setLoading(true); // 데이터를 다시 불러올 때 로딩 상태로 설정
    setError(null); // 에러 상태도 초기화

    // 백엔드 API URL이 없으면 요청을 보내지 않고 에러 처리
    if (!backendApiUrl) {
      console.error(
        "환경 변수 REACT_APP_BACKEND_API_URL이 설정되지 않았습니다."
      );
      setError("API 서버 주소를 찾을 수 없습니다. 관리자에게 문의해주세요.");
      setLoading(false);
      return;
    }

    // 백엔드 API로부터 할 일 목록을 가져오는 fetch 요청
    fetch(backendApiUrl) // <--- 환경 변수 사용
      .then((response) => {
        if (!response.ok) {
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
  }, [refreshKey, backendApiUrl]); // refreshKey와 backendApiUrl이 변할 때마다 이 useEffect가 다시 실행됩니다!

  // 할 일의 완료 상태를 토글하는 함수 (체크박스 클릭 시 호출)
  const handleToggleCompleted = async (id, currentCompletedStatus) => {
    if (!backendApiUrl) {
      // 환경 변수 체크
      alert("API 서버 주소를 찾을 수 없습니다.");
      return;
    }
    try {
      // 백엔드 API에 PUT 요청을 보냅니다.
      const response = await fetch(
        `${backendApiUrl}/${id}`, // <--- 환경 변수 사용 및 id 추가
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
    if (!backendApiUrl) {
      // 환경 변수 체크
      alert("API 서버 주소를 찾을 수 없습니다.");
      return;
    }
    if (!window.confirm("정말 이 할 일을 삭제하시겠습니까?")) {
      return; // 사용자가 취소하면 삭제하지 않음
    }
    try {
      // 백엔드 API에 DELETE 요청을 보냅니다.
      const response = await fetch(
        `${backendApiUrl}/${id}`, // <--- 환경 변수 사용 및 id 추가
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
