/* tslint:disable:ordered-imports */
/* tslint:disable:interface-name */
/* tslint:disable:object-literal-sort-keys */
/* tslint:disable:jsx-no-lambda */

import GameCell from './GameCell';
import { GameCellIsWhiteStatus } from '../types/CustomTypes';
import { initialGameBoard } from './GamePage';

import './GameBoard.css';
import * as React from 'react';

export interface GameBoardProps {
    board: GameCellIsWhiteStatus[];
}

export interface GameBoardState {
    board: GameCellIsWhiteStatus[];
    currentPlayerIsWhite: boolean;
    validCells: number[];
    passCount: number;
}

interface CellStatusAndIndex {
    status: GameCellIsWhiteStatus;
    index: number;
}

interface CellLine {
    items: CellStatusAndIndex[];
}

class GameBoard extends React.Component<GameBoardProps, GameBoardState> {
    constructor(props: GameBoardProps) {
        super(props);

        this.state = {
            board: props.board,
            currentPlayerIsWhite: false,
            validCells: [],
            passCount: 0
        };
    }

    public getBoardCellIndex(row: number, column: number): number {
        return row * 8 + column;
    }

    public getBoardCellCoords(index: number): { row: number, column: number } {
        const column = index % 8;
        const row = (index - column) / 8;

        return { row, column };
    }

    public getAdjacentCellCoords(row: number, column: number): number[][] {
        const allAdjacentCellRefs = [
            [row - 1, column - 1], [row - 1, column], [row - 1, column + 1],
            [row, column - 1], [row, column + 1],
            [row + 1, column - 1], [row + 1, column], [row + 1, column + 1]
        ];

        const adjacentRealCellRefs = allAdjacentCellRefs.filter(
            cellRef => cellRef[0] > -1 && cellRef[1] > -1 && cellRef[0] < 8 && cellRef[1] < 8
        );

        return adjacentRealCellRefs;
    }

    public getAdjacentCellLines(row: number, column: number, state: GameBoardState): CellLine[] {

        const result: CellLine[] = [];

        // start at 12 o'clock
        result.push(this.getAdjacentCellLine(row, column, -1, 0, state));
        result.push(this.getAdjacentCellLine(row, column, -1, 1, state));
        result.push(this.getAdjacentCellLine(row, column, 0, 1, state));
        result.push(this.getAdjacentCellLine(row, column, 1, 1, state));
        result.push(this.getAdjacentCellLine(row, column, 1, 0, state));
        result.push(this.getAdjacentCellLine(row, column, 1, -1, state));
        result.push(this.getAdjacentCellLine(row, column, 0, -1, state));
        result.push(this.getAdjacentCellLine(row, column, -1, -1, state));

        return result;
    }

    public getAdjacentCellLine(
        row: number,
        column: number,
        rowOffest: number,
        columnOffset: number,
        state: GameBoardState): CellLine {

        const result: CellLine = {
            items: []
        };

        let currentRowIndex = row;
        let currentColumnIndex = column;

        let adjacentCellStatusAndIndex: CellStatusAndIndex | null;

        do {
            adjacentCellStatusAndIndex =
                this.getAdjacentCellStatusAndIndex(
                    currentRowIndex,
                    currentColumnIndex,
                    rowOffest,
                    columnOffset,
                    state
                );

            if (adjacentCellStatusAndIndex) {
                result.items.push(adjacentCellStatusAndIndex);

                currentRowIndex += rowOffest;
                currentColumnIndex += columnOffset;
            }
        } while (!!adjacentCellStatusAndIndex);

        return result;
    }

    public getAdjacentCellStatusAndIndex(
        row: number,
        column: number,
        rowOffest: number,
        columnOffset: number,
        state: GameBoardState): CellStatusAndIndex | null {

        const candidateCellLineItemRowIndex = row + rowOffest;
        const candidateCellLineItemColumnIndex = column + columnOffset;

        const candidateCellLineItemRowIndexIsInRange =
            candidateCellLineItemRowIndex > -1 &&
            candidateCellLineItemRowIndex < 8;

        const candidateCellLineItemColumnIndexIsInRange =
            candidateCellLineItemColumnIndex > -1 &&
            candidateCellLineItemColumnIndex < 8;

        const candidateCellLineItemCoordsInRange =
            candidateCellLineItemRowIndexIsInRange &&
            candidateCellLineItemColumnIndexIsInRange;

        if (!candidateCellLineItemCoordsInRange) {
            return null;
        }

        const candidateCellLineItemIndex =
            this.getBoardCellIndex(candidateCellLineItemRowIndex, candidateCellLineItemColumnIndex);

        const candidateCellLineItemIsWhiteStatus = state.board[candidateCellLineItemIndex];

        return {
            status: candidateCellLineItemIsWhiteStatus,
            index: candidateCellLineItemIndex
        };
    }

    public getValidCells(currentState: GameBoardState): number[] {

        const emptyCells = currentState.board.map(
            (gameCellIsWhiteStatus: GameCellIsWhiteStatus, index: number): CellStatusAndIndex => {
                const isEmptyCell = gameCellIsWhiteStatus === undefined;

                if (isEmptyCell) {
                    return {
                        status: gameCellIsWhiteStatus,
                        index
                    };
                }

                return {
                    status: gameCellIsWhiteStatus,
                    index: -1
                };
            });

        const emptyCellsOnly = emptyCells.filter(emptyCell => emptyCell.index > -1);

        const emptyCellsWithAdjacentOpponentCell: CellStatusAndIndex[] = [];

        for (const emptyCell of emptyCellsOnly) {
            const column = emptyCell.index % 8;
            const row = (emptyCell.index - column) / 8;

            const adjacentCellLines = this.getAdjacentCellLines(row, column, currentState);

            for (const adjacentCellLine of adjacentCellLines) {
                if (adjacentCellLine.items.length) {

                    let adjacentOpponentCellCount = 0;

                    /* tslint:disable:prefer-for-of */
                    for (let i = 0; i < adjacentCellLine.items.length; i++) {
                        const currentAdjacentCellStatusAndIndex = adjacentCellLine.items[i];

                        const adjacentCellIsWhiteStatus = currentAdjacentCellStatusAndIndex.status;
                        const adjacentCellIsPopulated = adjacentCellIsWhiteStatus !== undefined;

                        if (!adjacentCellIsPopulated) {
                            break;
                        }

                        const adjacentCellIsOpponentCell = (
                            adjacentCellIsPopulated &&
                                currentState.currentPlayerIsWhite ?
                                !adjacentCellIsWhiteStatus : adjacentCellIsWhiteStatus
                        );

                        if (adjacentCellIsOpponentCell) {
                            adjacentOpponentCellCount++;
                        } else {
                            // Is current player cell
                            if (adjacentOpponentCellCount > 0) {
                                emptyCellsWithAdjacentOpponentCell.push(emptyCell);
                            }

                            break;
                        }
                    }
                }
            }
        }

        return emptyCellsWithAdjacentOpponentCell.map(emptyCell => emptyCell.index);
    }

    public getCapturedCellIndices(currentPlayerIsWhite: boolean, boardCellIndex: number, state: GameBoardState): number[] {
        let result: number[] = [];

        const column = boardCellIndex % 8;
        const row = (boardCellIndex - column) / 8;

        const adjacentCellLines = this.getAdjacentCellLines(row, column, state);

        for (const adjacentCellLine of adjacentCellLines) {
            if (adjacentCellLine.items.length) {

                let adjacentOpponentCellCount = 0;
                const adjacentOppentCellIndices: number[] = [];

                for (let i = 0; i < adjacentCellLine.items.length; i++) {
                    const currentAdjacentCellStatusAndIndex = adjacentCellLine.items[i];

                    const adjacentCellIsWhiteStatus = currentAdjacentCellStatusAndIndex.status;
                    const adjacentCellIsPopulated = adjacentCellIsWhiteStatus !== undefined;

                    if (!adjacentCellIsPopulated) {
                        break;
                    }

                    const adjacentCellIsOpponentCell = (
                        adjacentCellIsPopulated &&
                            currentPlayerIsWhite ?
                            !adjacentCellIsWhiteStatus : adjacentCellIsWhiteStatus
                    );

                    if (adjacentCellIsOpponentCell) {
                        adjacentOpponentCellCount++;
                        adjacentOppentCellIndices.push(currentAdjacentCellStatusAndIndex.index);
                    } else {
                        // Is current player cell
                        if (adjacentOpponentCellCount > 0) {
                            result = [
                                ...result,
                                ...adjacentOppentCellIndices
                            ];
                        }

                        break;
                    }
                }
            }
        }

        return result;
    }

    public restart() {
        const nextState = {
            board: initialGameBoard,
            currentPlayerIsWhite: false,
            validCells: [],
            passCount: 0
        };

        const nextStateValidCells = this.getValidCells(nextState);

        this.setState({
            board: nextState.board,
            currentPlayerIsWhite: nextState.currentPlayerIsWhite,
            validCells: nextStateValidCells,
            passCount: 0
        });
    }

    public pass() {
        // tslint:disable-next-line:no-console
        // console.log(`pass: currentPlayerIsWhite = ${this.state.currentPlayerIsWhite}`);

        const nextState = {
            board: this.state.board,
            currentPlayerIsWhite: !this.state.currentPlayerIsWhite,
            validCells: [],
            passCount: this.state.passCount + 1
        };

        const nextStateValidCells = this.getValidCells(nextState);

        this.setState({
            board: nextState.board,
            currentPlayerIsWhite: nextState.currentPlayerIsWhite,
            validCells: nextStateValidCells,
            passCount: nextState.passCount
        });
    }

    public selectRandomValidCell() {
        if (this.state.validCells.length === 0) {
            // tslint:disable-next-line:no-console
            // console.log('No valid cell is available - passing');
            this.pass();
            return;
        }

        const randomValidCellIndex = this.state.validCells[0];

        const { row, column } = this.getBoardCellCoords(randomValidCellIndex);

        this.handleCellClick(row, column);
    }

    public componentWillMount() {
        this.setState({ validCells: this.getValidCells(this.state) });
    }

    public componentDidUpdate() {
        if (this.state.currentPlayerIsWhite) {
            this.selectRandomValidCell();
        }
    }

    public handleCellClick(row: number, column: number) {
        const boardCellIndex = this.getBoardCellIndex(row, column);

        const capturedCellIndices =
            this.getCapturedCellIndices(this.state.currentPlayerIsWhite, boardCellIndex, this.state);

        const nextBoard: GameCellIsWhiteStatus[] = [];

        for (let i = 0; i < this.state.board.length; i++) {
            if (i === boardCellIndex) {
                nextBoard.push(this.state.currentPlayerIsWhite);
            } else {
                const currentGameCellIsWhiteStatus = this.state.board[i];

                if (capturedCellIndices.indexOf(i) > -1) {
                    nextBoard.push(this.state.currentPlayerIsWhite);
                } else {
                    nextBoard.push(currentGameCellIsWhiteStatus);
                }
            }
        }

        const nextState = {
            board: nextBoard,
            currentPlayerIsWhite: !this.state.currentPlayerIsWhite,
            validCells: [],
            passCount: 0
        };

        const validCells = this.getValidCells(nextState);

        this.setState({
            board: nextBoard,
            currentPlayerIsWhite: !this.state.currentPlayerIsWhite,
            validCells,
            passCount: 0
        });
    }

    public render(): JSX.Element {
        const gameCellRows: JSX.Element[] = [];

        for (let i = 0; i < 8; i++) {
            const gameCellColumns: JSX.Element[] = [];

            for (let j = 0; j < 8; j++) {
                const boardCellIndex = this.getBoardCellIndex(i, j);

                const isValidCell = this.state.validCells.indexOf(boardCellIndex) > -1;

                // tslint:disable-next-line:no-empty
                const noOp = () => { };
                const handleClickFunction = (row: number, column: number) => this.handleCellClick(row, column);

                const tdStyle= {
                    width: '20px'
                };

                gameCellColumns.push(
                    <td key={j} className="cell" style={tdStyle} /* width={20} */>
                        <GameCell
                            row={i}
                            column={j}
                            isWhite={this.state.board[boardCellIndex]}
                            handleClick={isValidCell ? handleClickFunction : noOp}
                            isValid={isValidCell}
                        />
                    </td>
                );
            }

            gameCellRows.push(<tr key={i}>{gameCellColumns}</tr>);
        }

        const discColor = this.state.currentPlayerIsWhite ? 'white' : 'black';

        // const discContent = '🌑';
        // const discContent = <i className="glyphicon glyphicon-certificate" aria-hidden="true" />;
        const discContent = (
            <span
                style={{
                    display: 'inline-block',
                    width: '1em',
                    height: '1em',
                    borderRadius: '0.5em',
                    margin: '0.125em',
                    backgroundColor: discColor
                }}
            />
        );

        const emptyCells = this.state.board.filter(item => item === undefined);
        const whitePlayerCells = this.state.board.filter(item => item !== undefined && item);
        const blackPlayerCells = this.state.board.filter(item => item !== undefined && !item);

        // tslint:disable-next-line:no-console
        // console.log(`passCount = ${this.state.passCount}`);
        const isGameFinished = (emptyCells.length === 0) || (this.state.passCount > 1);

        let winnerName: string = '';

        if (isGameFinished) {
            const whitePlayerCellCount = whitePlayerCells.length;
            const blackPlayerCellCount = blackPlayerCells.length;

            if (whitePlayerCellCount === blackPlayerCellCount) {
                winnerName = 'Neither: It was a Draw.';
            } else {
                winnerName = whitePlayerCellCount > blackPlayerCellCount ? 'White' : 'Black';
            }
        }

        const currentPlayerContent = (
            <div className="row" /* role="alert" */ style={{ background: '#090', marginLeft: '0', marginRight: '0' }}>
                {
                    isGameFinished &&
                    <div className="col-md-12">
                        <div style={{ fontSize: '20px', color: winnerName }}>
                            <span>Winner is {winnerName}!</span>
                        </div>
                    </div>
                }
                {
                    isGameFinished && this.state.passCount > 1 &&
                    <div className="col-md-12">
                        <div style={{ fontSize: '20px', color: winnerName }}>
                            <span>Both players have passed - game finished early</span>
                        </div>
                    </div>
                }
                {
                    !isGameFinished &&
                    <div className="col-md-12">
                        <div style={{ fontSize: '20px', color: discColor }}>
                            <span>Current Player: {discContent}</span>
                        </div>
                    </div>
                }
                <div className="col-md-12">
                    <div style={{ fontSize: '20px', color: 'white' }}>
                        <div>White: <span>{whitePlayerCells.length}</span></div>
                    </div>
                    <div style={{ fontSize: '20px', color: 'black' }}>
                        <div>Black: <span>{blackPlayerCells.length}</span></div>
                    </div>
                </div>
                <div className="col-md-12" style={{ fontSize: '20px' }}>
                    <div className="row">
                        <div className="col-sm-12">
                            <button
                                onClick={() => this.restart()}
                                style={{ width: '400px', margin: '5px' }}
                            >
                                Restart
                            </button>
                        </div>
                        {
                            !isGameFinished &&
                            <div className="row">
                                <div className="col-sm-12">
                                    <button
                                        onClick={() => this.selectRandomValidCell()}
                                        style={{
                                            width: '400px', margin: '5px',
                                            cursor: this.state.validCells.length === 0 ?
                                                'not-allowed' : 'auto'
                                        }}
                                        disabled={this.state.validCells.length === 0}
                                    >
                                        Select Random Valid Cell
                                    </button>
                                </div>
                                <div className="col-sm-12">
                                    <button
                                        onClick={() => this.pass()}
                                        style={{ width: '400px', margin: '5px' }}
                                    >
                                        {
                                            this.state.validCells.length === 0 && (
                                                <span style={{ color: 'black' }}>No valid moves: </span>
                                            )
                                        }
                                        <span>Pass</span>
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );

        return (
            <div>
                <table className="table table-bordered" style={{ tableLayout: 'fixed' }}>
                    <tbody>
                        {gameCellRows}
                    </tbody>
                </table>

                {currentPlayerContent}

                {/*<div>Valid Cells</div>
                <pre style={{ height: '100px', textAlign: 'left' }}>
                    {
                        JSON.stringify(
                            this.state.validCells.map(index => index),
                            null,
                            2
                        )
                    }
                </pre>*/}
            </div>
        );
    }
}

export default GameBoard;
