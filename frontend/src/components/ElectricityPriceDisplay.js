import React, { useState, useEffect } from 'react';

const ElectricityPriceDisplay = ({ price, lastChecked, onRefresh }) => {
  const [displayInCents, setDisplayInCents] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeElapsed(Date.now());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatTimeElapsed = () => {
    if (lastChecked !== null && timeElapsed !== null && timeElapsed > lastChecked) {
      const secondsElapsed = Math.floor((timeElapsed - lastChecked) / 1000);
      const minutes = Math.floor(secondsElapsed / 60);
      const seconds = secondsElapsed % 60;

      return `${minutes} minutes and ${seconds} seconds ago`;
    } else {
      return "0 minutes and 0 seconds ago";
    }
  };

  const toggleDisplay = () => {
    setDisplayInCents(!displayInCents);
  };

  const formattedPrice = displayInCents ? (price * 100).toFixed(2) : price.toFixed(4);

  return (
    <div>
      <h1 className="title">Electricity Price</h1>
      {price !== null ? (
        <div>
          <p>
            The current price is {' '}
            <span className="price" onClick={toggleDisplay}>
              {formattedPrice} {displayInCents ? '¢' : '€'}
            </span> / kWh.
          </p>
          <p className="last-checked">Last checked: {formatTimeElapsed()}</p>
        </div>
      ) : (
        <div>
          <p className="loading">Loading...</p>
        </div>
      )}
      <button className="refresh-button" onClick={onRefresh}>{price !== null ? 'Refresh' : 'Refreshing...'}</button>
    </div>
  );
};

export default ElectricityPriceDisplay;
