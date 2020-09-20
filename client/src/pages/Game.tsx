import React, {MouseEvent, useEffect, useRef} from "react";
import Commands from "../components/Commands";

import "../styles.css";
import {Room} from "colyseus.js";
import {Player} from "../types/Player";


type Path = {
    points: Array<{ x: number, y: number }>
    lineWidth: number
    strokeStyle: string | CanvasGradient | CanvasPattern
}

function getPositionFromEvent({pageX, pageY, target}: MouseEvent): [number, number] {
    const {offsetLeft, offsetTop} = target as HTMLElement;
    return [pageX - offsetLeft, pageY - offsetTop];
}

function updateContext(context: CanvasRenderingContext2D, properties: any) {
    Object.assign(context, properties);
}

function redraw(context: CanvasRenderingContext2D, paths: Path[]) {
    if (!context) {
        return;
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    paths.forEach((path) => {
        const {points, lineWidth, strokeStyle} = path;
        points.forEach((point, index) => {
            updateContext(context, {lineWidth, strokeStyle});
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


function clearCanvas(context: CanvasRenderingContext2D, paths: Path[]) {
    paths.splice(0, paths.length);
    redraw(context, paths);
}

type Props = {
    currentRoom?: Room
    players: Player[]
}

function Game ({currentRoom, players}: Props) {
    const canvasElement = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const paths: Path[] = [];
    let isDrawing = false;

    useEffect(() => {
        if (canvasElement.current !== null) {
            canvasElement.current.width = canvasElement.current.clientWidth;
            canvasElement.current.height = canvasElement.current.clientHeight;
            const context = canvasElement.current.getContext("2d");
            if (!context) {
                return;
            }
            contextRef.current = context;
            updateContext(contextRef.current!, {
                strokeStyle: "#df4b26",
                lineJoin: "round",
                lineWidth: 1
            });
        }
    }, [canvasElement]);

    function addClick(x: number, y: number) {
        const currentPath = paths[paths.length - 1];
        currentPath.points.push({x, y});
    }

    function onMouseDown(event: MouseEvent) {
        isDrawing = true;
        const context = contextRef.current!;
        const {lineWidth, strokeStyle} = context;
        paths.push({points: [], lineWidth, strokeStyle});
        addClick(...getPositionFromEvent(event));
        redraw(contextRef.current!, paths);
    }

    function onMouseMove(event: MouseEvent) {
        if (isDrawing) {
            addClick(...getPositionFromEvent(event));
            redraw(contextRef.current!, paths);
        }
    }

    function onMouseUp() {
        isDrawing = false;
    }

    return (
        <div className="app">
            <canvas
                ref={canvasElement}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
            />
            <Commands updateContext={(properties: any) => updateContext(contextRef.current!, properties)}
                      clearCanvas={() => clearCanvas(contextRef.current!, paths)}/>

            <h2>Players ({players.length})</h2>
            {players && players.map((player) =>
                <div key={`Player${player.sessionId}`}>
                    <h3>Player {player.sessionId}</h3>
                    <div>connected: {player.connected ? 'yes' : 'no'}</div>
                </div>
            )}
        </div>
    );
};

export default Game;
