import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';

const UsersPage = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'games', direction: 'desc' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.rpc('get_player_stats'); // 修正後のRPC関数
        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUserData(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return userData;

    return [...userData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [userData, sortConfig]);

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
      <h1 className="text-center mb-4">User Statistics</h1>
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort('player_name')} style={{ cursor: 'pointer' }}>
              Player {sortConfig.key === 'player_name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('games')} style={{ cursor: 'pointer' }}>
              Games {sortConfig.key === 'games' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('participation_rate')} style={{ cursor: 'pointer' }}>
            参加率 {sortConfig.key === 'participation_rate' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('win_rate')} style={{ cursor: 'pointer' }}>
              Win Rate {sortConfig.key === 'win_rate' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('total_kills')} style={{ cursor: 'pointer' }}>
              Total Kills {sortConfig.key === 'total_kills' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('total_deaths')} style={{ cursor: 'pointer' }}>
              Total Deaths {sortConfig.key === 'total_deaths' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('total_assists')} style={{ cursor: 'pointer' }}>
              Total Assists {sortConfig.key === 'total_assists' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('kda_value')} style={{ cursor: 'pointer' }}>
              Avg KDA {sortConfig.key === 'kda_value' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((user, index) => (
            <tr key={index}>
              <td>{user.player_name}</td>
              <td>{user.games}</td>
              <td>{user.participation_rate.toFixed(2)}%</td>
              <td>{user.win_rate.toFixed(2)}%</td>
              <td>{user.total_kills}</td>
              <td>{user.total_deaths}</td>
              <td>{user.total_assists}</td>
              <td>{user.avg_kda}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
