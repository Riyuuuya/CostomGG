import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UsersPage from "./UsersPage"; // ユーザーページ
import ChampionsPage from "./ChampionsPage"; // チャンピオンページ

const App = () => {
  return (
    <Router>
      <div>
        {/* ナビゲーションメニュー */}
        <nav>
          <ul>
            <li>
              <Link to="/">Users Page</Link>
            </li>
            <li>
              <Link to="/champions">Champions Page</Link>
            </li>
          </ul>
        </nav>

        {/* ルート設定 */}
        <Routes>
          <Route path="/" element={<UsersPage />} />
          <Route path="/champions" element={<ChampionsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
