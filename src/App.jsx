// src/App.jsx (전체 코드)
import "./App.css";
import React, { useState } from "react";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";

function App() {
  // 새로운 할 일이 추가되거나 삭제될 때 TodoList가 새로고침되도록 트리거하는 키
  const [refreshKey, setRefreshKey] = useState(0);

  // TodoForm이나 TodoList에서 할 일의 변경(추가/수정/삭제)이 발생하면 호출될 함수
  const handleListChanged = () => {
    setRefreshKey((prevKey) => prevKey + 1); // refreshKey를 증가시켜 TodoList를 새로고침!
  };

  return (
    <div className="App">
      <h1>나의 Todo 리스트 📝</h1>
      {/* TodoForm 컴포넌트 렌더링. 할 일 추가 후 리스트 새로고침 요청 */}
      <TodoForm onTodoAdded={handleListChanged} />
      {/* TodoList 컴포넌트 렌더링. refreshKey와 함께 onListChanged 함수도 전달 */}
      <TodoList refreshKey={refreshKey} onListChanged={handleListChanged} />
    </div>
  );
}

export default App;
