import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChampionsPage = () => {
  const [championData, setChampionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'games', direction: 'desc' }); // 初期ソートを「試合数」の降順

  useEffect(() => {
    const fetchChampionData = async () => {
      const { data, error } = await supabase.rpc('get_champion_stats');
      if (error) {
        console.error('Error fetching champion data:', error);
      } else {
        // 初期ソートを適用
        const sortedData = data.sort((a, b) => b.games - a.games);
        setChampionData(sortedData);
      }
      setLoading(false);
    };

    fetchChampionData();
  }, []);

  // ソート処理
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return championData;

    return [...championData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [championData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const direction = prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction };
    });
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Champion Statistics</h1>
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort('champion')} style={{ cursor: 'pointer' }}>
              Champion {sortConfig.key === 'champion' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('games')} style={{ cursor: 'pointer' }}>
              Games {sortConfig.key === 'games' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('pick_rate')} style={{ cursor: 'pointer' }}>
              Pick Rate {sortConfig.key === 'pick_rate' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('win_rate')} style={{ cursor: 'pointer' }}>
              Win Rate {sortConfig.key === 'win_rate' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th>Top Players</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((champion, index) => (
            <tr key={index}>
              <td>
                <img
                  src={`https://iujlirjxqyfjmmhgdmrm.supabase.co//storage/v1/object/public/champion-icons/ico_${champion.champion}.jpg`}
                  alt={champion.champion}
                  className="me-2"
                  style={{ width: '30px', height: '30px' }}
                />
                {champion.champion}
              </td>
              <td>{champion.games}</td>
              <td>{champion.pick_rate}%</td>
              <td>{champion.win_rate}%</td>
              <td>{champion.top_players.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChampionsPage;
