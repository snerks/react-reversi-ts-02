/* tslint:disable:ordered-imports */
/* tslint:disable:interface-name */
/* tslint:disable:object-literal-sort-keys */
/* tslint:disable:jsx-no-lambda */
/* tslint:disable:no-empty-interface */

import * as React from 'react';

import { GameCellIsWhiteStatus } from '../types/CustomTypes';
import GameBoard from './GameBoard';

export const initialGameBoard: GameCellIsWhiteStatus[] = [
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, true, false, undefined, undefined, undefined,
    undefined, undefined, undefined, false, true, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
];

export interface GamePageProps {
}

class GamePage extends React.Component<GamePageProps, {}> {
    public render(): JSX.Element {
        return (
            <GameBoard board={initialGameBoard} />
        );
    }
}

export default GamePage;
