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
            Max: {sorted[sorted.length - 1][1].toFixed(4)} {symbol}/{base} on
            {sorted[sorted.length - 1][0]}
          </span>
          <span className="red">
            Now: {data[data.length - 1].toFixed(4)} {symbol}/{base} on
            {labels[labels.length - 1]}
          </span>
        </div>
      </>
    );
  } else {
    return <></>;
  }
};

export default Statistics;
