import React, { useState, useEffect } from 'react';
import {getParkinglots} from "./ParkingLot";
import './App.css'

function App() {
  const [parkingLots, setParkingLots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const data = await getParkinglots({
            lat:32.0873,
            lon:34.7737,
        }   );
        setParkingLots(data);
      } catch (error) {
        console.error('Error fetching parking data:', error);
      }
      setIsLoading(false);
    };

    fetchParkingData();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
      <div className="App">
        <header>Your App Name</header>
        <div className="parking-lot-container">
          {parkingLots.map(lot => (
              <ParkingLotCard key={lot.name} data={lot} />
          ))}
        </div>
      </div>
  );
}

function ParkingLotCard({ data }) {
    // Assign a class based on the availability
    const statusClass = `parking-lot-card ${data.availability}`;

    return (
        <div className={statusClass}>
            <h2>{data.name}</h2>
            <p>{data.status}</p>
        </div>
    );
}


export default App;
