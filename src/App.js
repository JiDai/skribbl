import React, { useEffect, useRef } from "react";
import Commands from "./components/Commands";
import "./styles.css";

function getPositionFromEvent({ pageX, pageY, target }) {
  const { offsetLeft, offsetTop } = target;
  return [pageX - offsetLeft, pageY - offsetTop];
}

export default function App() {
  const canvasElement = useRef(null);
  const contextRef = useRef(null);
  const paths = [];
  let isDrawing = false;

  function updateContext(properties) {
    const context = contextRef.current;
    Object.assign(context, properties);
  }

  useEffect(() => {
    if (canvasElement.current) {
      canvasElement.current.width = canvasElement.current.clientWidth;
      canvasElement.current.height = canvasElement.current.clientHeight;
      const context = canvasElement.current.getContext("2d");
      contextRef.current = context;
      updateContext({
        strokeStyle: "#df4b26",
        lineJoin: "round",
        lineWidth: 1
      });
    }
  }, [canvasElement]);

  function redraw() {
    const context = contextRef.current;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    paths.forEach((path) => {
      const { points, lineWidth, strokeStyle } = path;
      points.forEach((point, index) => {
        updateContext({ lineWidth, strokeStyle });
        context.beginPath();
        if (index === 0) {
          context.moveTo(point.x - 1, point.y - 1);
        } else {
          context.moveTo(points[index - 1].x, points[index - 1].y);
        }
        context.lineTo(point.x, point.y);
        context.closePath();
        context.stroke();
      });
    });
  }

  function addClick(x, y) {
    const currentPath = paths[paths.length - 1];
    currentPath.points.push({ x, y });
  }

  function onMouseDown(event) {
    isDrawing = true;
    const { lineWidth, strokeStyle } = contextRef.current;
    paths.push({ points: [], lineWidth, strokeStyle });
    addClick(...getPositionFromEvent(event));
    redraw();
  }

  function onMouseMove(event) {
    if (isDrawing) {
      addClick(...getPositionFromEvent(event), true);
      redraw();
    }
  }

  function onMouseUp() {
    isDrawing = false;
  }

  function clearCanvas() {
    paths.splice(0, paths.length);
    redraw();
  }

  return (
    <div className="app">
      <canvas
        ref={canvasElement}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
      <Commands updateContext={updateContext} clearCanvas={clearCanvas} />
    </div>
  );
}
