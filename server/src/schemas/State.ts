import {ArraySchema, MapSchema, Schema, type} from '@colyseus/schema';
import { Player } from './Player';

export class State extends Schema {
    @type("string")
    currentTurn: string;

    @type({map: Player})
    players = new MapSchema<Player>();

    @type(["number"])
    board: number[] = new ArraySchema<number>(0, 0, 0, 0, 0, 0, 0, 0, 0);

    @type("string")
    winner: string;

    @type("boolean")
    draw: boolean;

    @type("boolean")
    gameStarted: boolean;
}
