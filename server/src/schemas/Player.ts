import {ArraySchema, MapSchema, Schema, type} from '@colyseus/schema';

// An abstract player object, demonstrating a potential 2D world position
export class Player extends Schema {
    @type("string")
    sessionId: string;

    @type("string")
    name: string;

    @type("boolean")
    connected: boolean;
}
