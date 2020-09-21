import React, {useEffect} from 'react';
import {Room} from "colyseus.js";

import {Player} from "../types/Player";


type Props = {
    currentRoom?: Room
    players: Player[]
    launchGame: Function
    onLaunchGame: Function
    onStopGame: Function
}

/**
 * Lobby Functional Component.
 */
function Lobby({currentRoom, players, launchGame, onLaunchGame, onStopGame}: Props) {
        console.log('currentRoom: ', currentRoom)
    useEffect(() => {
        console.log('currentRoom?.state: ', currentRoom?.state)
        if(currentRoom?.state.gameStarted) {
            onLaunchGame()
        }
    }, [currentRoom?.state.gameStarted])

    return (
        <div className="Lobby">
            {currentRoom && <div>
                <h1>In a room {currentRoom?.id}</h1>
                <div>
                    <button onClick={() => launchGame()}>Start game</button>
                </div>

                <h2>Players ({players.length})</h2>
                {players && players.map((player) =>
                    <div key={`Player${player.sessionId}`}>
                        <h3>Player {player.sessionId}</h3>
                        <div>connected: {player.connected ? 'yes' : 'no'}</div>
                    </div>
                )}
            </div>}
        </div>
    );
}

export default Lobby;
