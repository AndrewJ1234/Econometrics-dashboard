import './App.css';
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import fact_environmental_data from "./fact_environmental_data.csv";
import Papa from 'papaparse';
import {Line} from 'react-chartjs-2'; // used to create line chart

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement,
    Title,
    Tooltip,   
    Legend,
);

function App() {
  // Initalize state variables for chart data and loading status
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading ] = useState(true);

  // Use useEffect hook to fetch and parse data when component mounts
  useEffect(() => {
    const fetchParseData = async () => {
      Papa.parse(fact_environmental_data, {
        download: true,
        header: true,
        delimiter: ",", // sets field delimiter to ","
        dynamicTyping: true, // convert num/bool input as their respective types
        complete: (result) => {
          // Get the months from the fields array in the meta object
          let labels = result.meta.fields.slice(1); // Exclude the first field which is an empty string

          let datasets = result.data.map((row) => {
            // Get the type of data from the first property in the row
            let label = Object.values(row)[0];

            // Get the amounts for each month from the rest of the properties in the row
            let data = Object.values(row).slice(1);

            return {
              label: label,
              data: data,
              borderColor: "black",
              backgroundColor: "red"
            };
          });
          // Updates the chartData state with the parsed data
          setChartData({ 
            labels: labels, 
            datasets: datasets
          });
          // Update loading status
          setIsLoading(false);
        },
      });
    };
    fetchParseData();
  }, []);
  // Renders the App component
  return (
    <div className="App">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        chartData.datasets.map((dataset, index) => (
          <div key={index}>
            <Line options={{ responsive: true }} data={{ labels: chartData.labels, datasets: [dataset] }} />
          </div>
        ))
      )}
    </div>
  );
}
export default App;
