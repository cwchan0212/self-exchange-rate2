# Plot the graph of the exchange rates for different currencies

Exchange rates API of [exchangerate.host](https://exchangerate.host/) is a simple and lightweight free service for current and historical foreign exchange rates & crypto exchange rates. Reliable and up-to-date EU VAT rates, sourced directly from the European Commission's databases. This tool helps people review market history and analyse rate trends for any currency pair.

### Demostration
https://bit.ly/3gCEnXH

### Folder Structure

```sh
components/
├─ Statistics.js
public/
├─ favicon.ico
├─ index.html
src/
├─ App.css
├─ App.js
├─ index.js
package-lock.json
package.json
```

## Steps to complete the project

### Step 1: Define the initial states of days, base and symbol currencies

**App.js**

```js
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

```

### Step 2: Create function fetchData to fetch the exchange rate api with the parameters: days, base and symbol. 

```js
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
 ```

### Step 3: Use useEffect to execute the function fetchData and render the page

```js
  React.useEffect(() => {
    fetchData(options);
  }, []);
```

### Step 4: Create the labels and data variables for the change of chart data 



```js
  const labels = chartData.labels ? chartData.labels : [];
  const data = (chartData.datasets.length !== 0) ? chartData.datasets[0].data : [];
 ```


### Step 5: Plot the line chart and generate the Statistics with label, data, base and symbol variables


```js
      <div className="App">
        <Line data={chartData} options={chartOptions} width={100} height={50} />
        <Statistics
          labels={labels}
          data={data}
          base={options.base}
          symbol={options.symbol}
        />
```

### Step 6: Create the buttons of base, symbol and days option

```
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
```


### Step 7: Create the component Statistics to generate the minimum and maximum exchange rates with certain days

**Statistics.js** 

```js
import React from "react";

const Statistics = ({ labels, data, base, symbol }) => {
  let sorted = labels.map((v, i) => {
    return [v, data[i]];
  });
  sorted = sorted.sort((a, b) => a[1] - b[1]);

  if (sorted.length) {
    return (
      <>
        <div className="info">
          <span>
            Min: {sorted[0][1].toFixed(4)} {symbol}/{base} on {sorted[0][0]}
          </span>
          <span>
            Max: {sorted[sorted.length - 1][1].toFixed(4)} {symbol}/{base} on {sorted[sorted.length - 1][0]}
          </span>
          <span className="red">
            Now: {data[data.length - 1].toFixed(4)} {symbol}/{base} on {labels[labels.length - 1]}
          </span>
        </div>
      </>
    );
  } else {
    return <></>;
  }
};

export default Statistics;
```
