import React, { useState, useEffect } from 'react';
import {getParkinglots, sortNearMe, wazeURL} from "./ParkingLot";
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
    const [isLoading, setIsLoading] = useState(false);

    const fetchParkingData = async () => {
        setIsLoading(true); // Start loading
        try {
            const data = await getParkinglots(selectedLocation);
            setParkingLots(data);
        } catch (error) {
            console.error('Error fetching parking data:', error);
        } finally {
        setIsLoading(false); // Stop loading regardless of success or failure
    }
    };

  useEffect(() => {
    fetchParkingData();
  }, []);

    const handleLocationChange = (event) => {
        const location = locations.find(loc => loc.name === event.target.value).location;
        setSelectedLocation(location);
        setParkingLots(sortNearMe(parkingLots, location))
    };


    function loadingComponent() {
        return <div className="loading-indicator">
            <div className="spinner"></div>
        </div>;
    }

    function isDataReady() {
        return parkingLots.length !== 0;
    }

    function ParkingLotListComponent() {
        return <div>
            <div className="select-wrapper">
                <select onChange={handleLocationChange} className="modern-select">
                    {locations.map(loc => (
                        <option key={loc.name} value={loc.name}>{loc.name}</option>
                    ))}
                </select>
                <span className="select-arrow">&#9662;</span> {/* Downward arrow symbol */}
            </div>
            <div className="parking-lot-container">
                {parkingLots.map(lot => (
                    <ParkingLotCard key={lot.name} data={lot}/>
                ))}
            </div>
        </div>;
    }

    function errorRefreshButton() {
        return <button className="error-message-button"
                       onClick={fetchParkingData}
        >
            תקלה בגישה לחניונים, לחץ שוב לרענון
        </button>;
    }

    return (
        <div className="App">
            <div className="cool-title">
                Parking To The People
            </div>

            {isLoading ? loadingComponent() : (
                <div>
                    {isDataReady() ? ParkingLotListComponent() : errorRefreshButton()}
                </div>
            )}
        </div>
    );

}

function ParkingLotCard({ data }) {
    // Assign a class based on the availability
    const statusClass = `parking-lot-card ${data.availability}`;

    return (
        <a href={wazeURL(data.location)} target="_blank" className="link-wrapper">
            <div className={statusClass}>
                <h2>{data.name}</h2> <p>{data.status}</p>
            </div>
        </a>
    );
}


export default App;
