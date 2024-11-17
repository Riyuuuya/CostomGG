import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const App = () => {
  const [matchHistory, setMatchHistory] = useState([]);

  // データ取得処理
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('match_history') // テーブル名を指定
      .select('*'); // 全データを取得

    if (error) {
      console.error('データ取得エラー:', error);
    } else {
      setMatchHistory(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Match History</h1>
      <ul>
        {matchHistory.map((match) => (
          <li key={match.id}>
            {match.player} - {match.win ? 'Win' : 'Lose'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
