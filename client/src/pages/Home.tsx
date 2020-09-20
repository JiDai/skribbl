import React from 'react';
import {RoomAvailable} from "colyseus.js";

type Props = {
    newRoom: Function
    joinRoom: Function
    availableRooms: RoomAvailable<any>[]
}

/**
 * Home Functional Component.
 */
function Home({newRoom, availableRooms, joinRoom}: Props) {
    return (
        <div className="Home">
            <h1>Welcome</h1>

            <h2>Create a party</h2>
            <p>
                <label htmlFor="name">
                    Your name
                    <input type="text" name="name" id="name"/>
                </label>
                <button onClick={() => newRoom()}>Open new room</button>
            </p>

            <h2>Join a party</h2>
            {availableRooms && availableRooms.map((availableRoom) =>
                <div key={`Room${availableRoom.roomId}`}>
                    <h3>Room {availableRoom.roomId}</h3>
                    <div>clients: {availableRoom.clients}</div>
                    <div>maxClients: {availableRoom.maxClients}</div>
                    <div>metadata: {availableRoom.metadata}</div>
                    <div>
                        <button onClick={() => joinRoom(availableRoom.roomId)}>Join</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
