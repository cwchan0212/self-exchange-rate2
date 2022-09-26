// Reference: https://youtu.be/FXuElLhCK8s
// https://github.com/adrianhajdin/advice_app/blob/master/src/App.js
// https://codesandbox.io/s/exciting-browser-4mtiux?file=/src/App.tsx

import "./App.css";
import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Statistics from "./components/Statistics";

function App() {
  const dayOptions = [7, 30, 60, 90, 180, 360];
  const baseOptions = ["HKD", "USD", "GBP", "EUR", "JPY", "CNY"];
  const symbolOptions = ["HKD", "USD", "GBP", "EUR", "JPY", "CNY"]
  // const [selected, setSelected] = React.useState(7);

  // const [labels, setLabels] = React.useState([]);
  // const [data, setData] = React.useState([]);
  // const [rates, setRates] = React.useState({});
  const [days, setDays] = React.useState(30);
  const [base, setBase] = React.useState("GBP");
  const [symbol, setSymbol] = React.useState("HKD");

  const [chartData, setChartData] = React.useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = React.useState({});

  // let base = "GBP";
  // let symbol = "HKD";
  
  
  
  async function fetchData({days}) {
    // const dateTo = new Date();
    const baseURL = "https://api.exchangerate.host";

    const params = {
      // start_date: new Date(new Date().getTime() - (days - 1) * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      start_date: new Date(new Date().setDate(new Date().getDate() - days + 1))
        .toISOString()
        .substring(0, 10),
      end_date: new Date().toISOString().substring(0, 10),
      base: base,
      symbols: symbol,
    };
    setDays(days);
    console.log("days", days);
        const queryString = new URLSearchParams(params).toString();
    // console.log("queryString", queryString);

    const uri = baseURL + "/timeseries?" + queryString;
    // console.log("uri", uri);

    try {
      let response = await fetch(uri);
      let jsons = await response.json();
      const rates = jsons["rates"];
      // setRates(rates);
      // const s = Object.values(jsons.rates).map((val) => (val)[symbol])

      const chartData = {
        labels: Object.keys(jsons["rates"]),
        datasets: [
          {
            label: symbol,
            data: Object.values(jsons.rates).map((val) => (val)[symbol]),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 253, 0.4)",
          },
        ],
      };
      setChartData(chartData);
      // config
      setChartOptions({
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "end",
          },
          title: {
            display: true,
            text: "Exchange Rate: " + symbol + "/" + base,
            font: {
              size: 20,
            },
          },
        },

        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "",
            },
            ticks: {
              autoSkip: true,
              // padding: 20,
            },
            grid: {
              // display: false,
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "",
            },
            grid: {
              // display: false,
            },
          },
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    fetchData(days);
  }, []);

  console.log("chartData", chartData?.labels, chartData.datasets[0]?.data)
  // const labelArr = chartData.labels;
  // const dataArr = chartData.datasets[0]?.data;
  const labels = (chartData?.labels) ? (chartData?.labels) : [];
  const data = (chartData.datasets[0]?.data) ? chartData.datasets[0]?.data : [];

  return (
    <>
      <div className="App">
        <Line data={chartData} options={chartOptions} width={100} height={50} />
        <Statistics labels={labels} data={data} base={base} symbol={symbol} />

        <div className="baseOptions">
          {baseOptions.map((baseOpt) => (
            <button
              key={baseOpt}
              style={{ minWidth: "80px" }}
              className={`btn btn-${
                baseOpt === base ? "primary" : "secondary"
              } btn-sm`}
              
            >
              {baseOpt}
            </button>
          ))}
        </div>

        <div className="symbolOptions">
          {symbolOptions.map((symbolOpt) => (
            <button
              key={symbolOpt}
              style={{ minWidth: "80px" }}
              className={`btn btn-${
                symbolOpt === symbol ? "primary" : "secondary"
              } btn-sm`}
              onClick={() => fetchData(symbolOpt)}
            >
              {symbolOpt}
            </button>
          ))}
        </div>

        <div className="dayOptions">
          {dayOptions.map((dayOpt) => (
            <button
              key={dayOpt}
              style={{ minWidth: "80px" }}
              className={`btn btn-${
                dayOpt === days ? "primary" : "secondary"
              } btn-sm`}
              onClick={() => fetchData(dayOpt)}
            >
              {dayOpt}
            </button>
          ))}
        </div>

 
      </div>
    </>
  );
}

export default App;
