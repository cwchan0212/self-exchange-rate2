import React, { useState, useEffect, useRef } from "react";
import { stringify } from "query-string";
import { Line } from "react-chartjs-2";
import axios from "axios";
import subDays from "date-fns/subDays";
import startOfToday from "date-fns/startOfToday";
import format from "date-fns/format";
import useSWR from "swr";
import "chart.js/auto";
import "./styles.css";

const base = "GBP";
const compare = "HKD";
const dayOptions = [7, 30, 60, 90, 180, 360];

const instance = axios.create({
  baseURL: "https://api.exchangerate.host"
});

const fetch = (daysBefore: number) => async (url: string) => {
  try {
    const query = stringify({
      start_date: format(subDays(startOfToday(), daysBefore), "yyyy-MM-dd"),
      end_date: format(startOfToday(), "yyyy-MM-dd"),
      base,
      symbols: compare
    });

    const { data } = await instance.get(`${url}?${query}`);

    const result = {
      labels: Object.keys(data?.rates),
      datasets: [
        {
          label: compare,
          data: Object.values(data?.rates).map((val) => (val as any)[compare]),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 253, 0.4)"
        }
      ]
    };

    return result;
  } catch (err) {
    console.log("err", err);
  }
};

const App: React.FC = () => {
  const init = useRef<boolean>(false);
  const [selected, setSelected] = useState<number>(7);
  const { data, mutate } = useSWR("/timeseries", fetch(selected));

  useEffect(() => {
    if (init.current) {
      void (async () => {
        await mutate();
      })();
    }
    init.current = true;
  }, [selected]);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Line
        data={data ?? { datasets: [] }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top" as const
            },
            title: {
              display: true,
              text: "Chart.js Line Chart"
            }
          }
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {dayOptions.map((dayOpt) => (
          <button
            key={dayOpt}
            style={{ minWidth: "100px" }}
            className={`btn btn-${
              dayOpt === selected ? "primary" : "secondary"
            }`}
            onClick={() => setSelected(dayOpt)}
          >
            {dayOpt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
