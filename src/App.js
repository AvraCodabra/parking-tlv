import React, { useState, useEffect } from 'react';
import {getParkinglots, sortNearMe} from "./ParkingLot";
import './App.css'

function App() {
    const locations = [
        { name: "הצפון הישן", location: { lat: 32.0873, lon: 34.7737 } },
        { name: "הצפון החדש", location: { lat: 32.088825, lon: 34.790115 } },
        { name: "לב העיר", location: { lat: 32.067596, lon: 34.775948 } },
        { name: "דרום העיר", location: { lat: 32.055776, lon: 34.768095 } },
    ];
    const [selectedLocation, setSelectedLocation] = useState(locations[0].location);
    const [parkingLots, setParkingLots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const data = await getParkinglots(selectedLocation);
        setParkingLots(data);
      } catch (error) {
        console.error('Error fetching parking data:', error);
      }
      setIsLoading(false);
    };

    fetchParkingData();
  }, [selectedLocation]);

    const handleLocationChange = (event) => {
        const location = locations.find(loc => loc.name === event.target.value).location;
        setSelectedLocation(location);
        setParkingLots(sortNearMe(parkingLots, location))
    };

  if (isLoading) return <div>Loading...</div>;

  return (
      <div className="App">
          <header>Parking To The People</header>
          <select onChange={handleLocationChange} className="modern-select">
              {locations.map(loc => (
                  <option key={loc.name} value={loc.name}>{loc.name}</option>
              ))}
          </select>
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
