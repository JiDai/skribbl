import React from 'react';
import {Route, RouteComponentProps, Switch, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {RoomAvailable} from "colyseus.js";

import GameManager from "../services/GameManager";
import {Player} from '../types/Player';
import Home from "../pages/Home";
import Lobby from "../pages/Lobby";
import Join from "../pages/Join";
import Game from "../pages/Game";

type Props = RouteComponentProps

type State = {
    players: Player[],
    availableRooms: RoomAvailable<any>[]
}

/**
 * App Functional Component.
 */
class App extends React.Component<Props, State> {
    gameManager: GameManager | null = null;

    constructor(props: Props) {
        super(props);

        this.state = {
            availableRooms: [],
            players: [],
        };
    }

    componentDidMount() {
        this.gameManager = new GameManager(this.setState.bind(this), this.props.history);
        this.gameManager.updateRooms();
    }

    componentWillUnmount() {
        if (this.gameManager) {
            this.gameManager.cleanRoom();
        }
    }

    render() {
        const {players, availableRooms} = this.state;

        if (this.gameManager) {
            const {currentRoom} = this.gameManager;

            return (
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                        </ul>
                    </nav>

                    <Switch>
                        <Route exact path="/">
                            <Home newRoom={() => this.gameManager?.newRoom()}
                                  availableRooms={availableRooms}
                                  joinRoom={(roomId: string) => this.gameManager?.join(roomId)}

                            />
                        </Route>

                        <Route exact path="/lobby">
                            <Lobby currentRoom={currentRoom}
                                   launchGame={() => this.gameManager?.newGame()}
                                   players={this.state.players}
                                   onLaunchGame={() => this.props.history.push('/game')}
                                   onStopGame={() => this.props.history.push('/')}
                            />
                        </Route>

                        <Route exact path="/game">
                            <Game currentRoom={currentRoom}
                                  players={this.state.players}/>
                        </Route>

                        <Route exact path="/join/:roomId">
                            <Join/>
                        </Route>
                    </Switch>
                </div>
            );
        }

        return null;

    }
}

export default withRouter(App);
