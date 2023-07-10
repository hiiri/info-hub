import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const TemperatureGraph = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [isGraphVisible, setIsGraphVisible] = useState(true);

    const toggleGraphVisibility = () => {
        setIsGraphVisible(!isGraphVisible);
    };

    useEffect(() => {
        if (!data || !chartRef.current || !isGraphVisible) {
            return;
        }

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        }

        // data for next 24 hours
        const hourlyData = data.list.slice(0, 24);

        const chartData = {
            labels: hourlyData.map((hour) => new Date(hour.dt * 1000).getHours() + ':00'),
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: hourlyData.map((hour) => hour.main.temp),
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)',
                },
            ],
        };

        chartInstanceRef.current = new Chart(chartRef.current, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time',
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Temperature (°C)',
                        },
                        beginAtZero: true,
                    },
                },
            },
        });
    }, [data, isGraphVisible]);

    return (
        <div className="temperature-graph">
            <button onClick={toggleGraphVisibility}>{isGraphVisible ? 'Hide Graph' : 'Show Graph'}</button>
            {isGraphVisible && <><h2>Next 24 hours</h2><canvas ref={chartRef} /></>}
        </div>
    );
};

export default TemperatureGraph;
