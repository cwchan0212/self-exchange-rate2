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
  const symbolOptions = ["HKD", "USD", "GBP", "EUR", "JPY", "CNY"];

  const [options, setOptions] = React.useState({
    days: 30,
    base: "GBP",
    symbol: "HKD",
  });

  const [chartData, setChartData] = React.useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = React.useState({});
  async function fetchData(opts) {
    const { days, base, symbol } = opts;
    setOptions({
      days: days ? days : options.days,
      base: base ? base : options.base,
      symbol: symbol ? symbol : options.symbol,
    });

    const baseURL = "https://api.exchangerate.host";

    const params = {
      start_date: new Date(new Date().setDate(new Date().getDate() - days + 1))
        .toISOString()
        .substring(0, 10),
      end_date: new Date().toISOString().substring(0, 10),
      base: base,
      symbols: symbol,
    };

    const queryString = new URLSearchParams(params).toString();
    // console.log("queryString", queryString);

    const uri = baseURL + "/timeseries?" + queryString;

    try {
      let response = await fetch(uri);
      let jsons = await response.json();
      // const rates = jsons["rates"];

      const chartData = {
        labels: Object.keys(jsons["rates"]),
        datasets: [
          {
            label: symbol,
            data: Object.values(jsons.rates).map((val) => val[symbol]),
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
    fetchData(options);
  }, []);

  console.log("chartData", chartData.datasets  === undefined);

  const labels = chartData.labels ? chartData.labels : [];
  const data = (chartData.datasets.length !== 0) ? chartData.datasets[0].data : [];

  return (
    <>
      <div className="App">
        <Line data={chartData} options={chartOptions} width={100} height={50} />
        <Statistics
          labels={labels}
          data={data}
          base={options.base}
          symbol={options.symbol}
        />

        <div className="baseOptions">
          <button
            type="button"
            class="btn btn-dark btn-sm"
            style={{ minWidth: "80px" }}
            disabled
          >
            BASE
          </button>
          {baseOptions.map((baseOpt) => (
            <button
              key={baseOpt}
              style={{ minWidth: "80px" }}
              className={`btn btn-${
                baseOpt === options.base ? "primary" : "outline-dark"
              } btn-sm`}
              onClick={() =>
                fetchData({
                  days: options.days,
                  base: baseOpt,
                  symbol: options.symbol,
                })
              }
            >
              {baseOpt}
            </button>
          ))}
        </div>

        <div className="symbolOptions">
          <button
            type="button"
            class="btn btn-dark btn-sm"
            style={{ minWidth: "80px" }}
            disabled
          >
            SYMBOL
          </button>
          {symbolOptions.map((symbolOpt) => (
            <button
              key={symbolOpt}
              style={{ minWidth: "80px" }}
              className={`btn btn-${
                symbolOpt === options.symbol ? "primary" : "outline-dark"
              } btn-sm`}
              onClick={() =>
                fetchData({
                  days: options.days,
                  base: options.base,
                  symbol: symbolOpt,
                })
              }
            >
              {symbolOpt}
            </button>
          ))}
        </div>

        <div className="dayOptions">
          <button
            type="button"
            class="btn btn-dark btn-sm"
            style={{ minWidth: "80px" }}
            disabled
          >
            DAYS
          </button>
          {dayOptions.map((dayOpt) => (
            <button
              key={dayOpt}
              style={{ minWidth: "80px" }}
              className={`btn btn-${
                dayOpt === options.days ? "primary" : "outline-dark"
              } btn-sm`}
              onClick={() =>
                fetchData({
                  days: dayOpt,
                  base: options.base,
                  symbol: options.symbol,
                })
              }
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
