
import React from "react";

function getCoordinate(props) {
    const element = document.getElementById(props.id);
    const rect = element.getBoundingClientRect(); 
    document.getElementById("demo1").innerHTML =
  "Left: " + rect.left.toFixed() + ", Top: " + rect.top.toFixed() + ", Width: " + rect.width + ", Height: " + rect.height;
  return <p id="demo1"></p>;
  }

export default getCoordinate;