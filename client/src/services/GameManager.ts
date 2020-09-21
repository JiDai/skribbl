import {toast} from "react-toastify";
import {Client, Room} from "colyseus.js";
import Cookies from 'js-cookie';

import {Player} from "../types/Player";
import {History, LocationState} from "history";

export interface FieldsObject {
    [i: string]: any;
}

const endpoint = "ws://localhost:3553";
const ROOM_NAME = "skribbl";

export const getSearchParamsAsObject = () => {
    return window.location.search
        .replace(/^\?/, '')
        .split('&')
        .reduce((previous: FieldsObject, current) => {
            if (current !== '') {
                const param = current.split('=');
                // eslint-disable-next-line no-param-reassign
                previous[param[0]] =
                    param.length > 1 ? decodeURIComponent(param[1].replace(/\+/g, ' ')) : true;
            }

            return previous;
        }, {});
};


export default class GameManager {
    colyseusClient: Client;
    currentRoom?: Room;
    setState: Function;
    history: History<LocationState>;

    constructor(setState: Function, history: History<LocationState>) {
        this.setState = setState;
        this.history = history;

        this.colyseusClient = new Client(endpoint);
        this.setState({
            serverOK: true
        });

        const {roomId} = getSearchParamsAsObject();
        const sessionId = this.getSession();

        if (roomId && sessionId) {
            const toastId = toast.info('Reconnecting...');
            this.colyseusClient.reconnect(roomId, sessionId)
                .then(this.handleConnectionSuccess.bind(this))
                .catch(this.handleConnectionError.bind(this));
        } else if (roomId) {
            toast.info('Joining room...');
            this.colyseusClient.joinById(roomId)
                .then(this.handleConnectionSuccess.bind(this))
                .catch(this.handleConnectionError.bind(this));
        }
    }

    cleanRoom() {
        if (this.currentRoom) {
            this.currentRoom.removeAllListeners();
            this.currentRoom.leave();
        }
    }

    updateRooms() {
        this.colyseusClient.getAvailableRooms(ROOM_NAME)
            .then(rooms => {
                this.setState({availableRooms: rooms});
            })
            .catch(e => {
                console.error(e);
            });
    }

    updatePlayers(players: Player[]) {
        this.setState({
            players
        });
    }

    async newGame() {
        if (this.currentRoom) {
            this.currentRoom.send("startGame", {});
            this.history.push('/game');
        } else {
            console.error('Current room not created, cannot start the game');
        }
    }

    async newRoom() {
        if (!this.colyseusClient) {
            return;
        }

        try {
            this.currentRoom = await this.colyseusClient.create(ROOM_NAME);
            this.history.push('/lobby');
        } catch (error) {
            this.handleConnectionError(error);
            return;
        }

        this.handleConnectionSuccess(this.currentRoom);
    }

    async join(roomId: string) {
        if (!this.colyseusClient) {
            return;
        }

        try {
            this.currentRoom = await this.colyseusClient.joinById(roomId);
            this.history.push('/lobby');
        } catch (error) {
            this.handleConnectionError(error);
            return;
        }

        this.handleConnectionSuccess(this.currentRoom);
    }

    handleConnectionSuccess(currentRoom: Room) {
        this.saveSession(currentRoom.sessionId);

        currentRoom.onLeave(() => {
            this.cleanRoom();
        });

        currentRoom.state.players.onChange = () => {
            this.updatePlayers(Object.values(currentRoom.state.players));
        };

        currentRoom.state.onChange = () => {
            this.updateRooms();
        };

        currentRoom.onError.once(() => window.alert('error'));

        toast.dismiss();
        toast.success('Connected', {});
    }

    handleConnectionError(error: Error) {
        this.cleanSession();
        toast.error(`Unable to reconnect (${error.message})`, {});
        toast.dismiss();
        console.error("join error", error);
    }

    saveSession(id: string) {
        Cookies.set('roomSessionId', id, {path: '/'});
    }

    cleanSession() {
        Cookies.set('roomSessionId', '', {path: '/'});
    }

    getSession(): string | undefined {
        return Cookies.get('roomSessionId');
    }
}
