import {Client, Delayed, Room} from 'colyseus';
import { State } from './schemas/State';
import { Player } from './schemas/Player';

const TURN_TIMEOUT = 10;
const BOARD_WIDTH = 3;

export class SkribblRoom extends Room<State> {
    maxClients = 6;
    randomMoveTimeout: Delayed;

    onCreate() {
        this.setState(new State());

        this.onMessage("startGame", (client, message) => {
            console.log('"startGame": ', "startGame")
            this.state.gameStarted = true
        });
    }

    onJoin(client: Client) {
        const player = new Player()
        player.sessionId = client.sessionId
        player.connected = true;
        this.state.players[client.sessionId] = player;
        const playersCount = Object.keys(this.state.players).length

        if (playersCount === this.maxClients
        ) {
            // lock this room for new users
            this.lock();
        }

        console.log(`${this.roomId} has ${playersCount} players`)
    }

    async onLeave(client, consented: boolean) {
        this.unlock();

        try {
            if (consented) {
                throw new Error("consented leave");
            }

            // allow disconnected client to reconnect into this room until 20 seconds
            await this.allowReconnection(client, 20);

            // client returned! let's re-activate it.
            this.state.players[client.sessionId].connected = true;
        } catch (e) {
            // 20 seconds expired. let's remove the client.
            delete this.state.players[client.sessionId];
        }

        let remainingPlayerIds = Object.keys(this.state.players);
        const playersCount = remainingPlayerIds.length
        console.log(`${this.roomId} has ${playersCount} players`)
    }

}
