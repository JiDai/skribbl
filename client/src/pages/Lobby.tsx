import React from 'react';
import {Room} from "colyseus.js";

import {Player} from "../types/Player";


type Props = {
    currentRoom?: Room
    players: Player[]
    launchGame: Function
}

/**
 * Lobby Functional Component.
 */
function Lobby({currentRoom, players, launchGame}: Props) {
    return (
        <div className="Lobby">
            <h1>Welcome</h1>

            {currentRoom && <div>
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
