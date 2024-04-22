import React from "react";
import ReactLogo from "./ReactLogo";

export default ({ item, totalPollScore }) => {
  const percentage = item.score / totalPollScore;

  return (
    <>
      <ReactLogo />
      <p style={{ display: "inline", margin: "0" }}>{item.text}</p>
      <div
        style={{
          position: "relative",
          height: "17px",
          width: "100px",
          border: "1px solid #FFF",
          display: "block",
          margin: "0 6px",
        }}
      >
        <div
          className="filler"
          style={{
            background: "#1DA598",
            height: "100%",
            borderRadius: "inherit",
            transition: "width .2s ease-in",
            width: `${100 * percentage}%`,
          }}
        />
      </div>
      <p
        style={{
          color: "rgba(255, 255, 255, 0.3)",
          display: "block",
          height: "17px",
          margin: "0 6px",
        }}
      >
        {`${item.score} (${(100 * percentage).toFixed(2)}%)`}
      </p>
      <br />
    </>
  );
};
