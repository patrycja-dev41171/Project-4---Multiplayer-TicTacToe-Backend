export interface GameMove {
    board: [string];
    room: string;
    player: string;
    game_points: {
        playerX: number,
        playerO: number,
    };
}

export interface GameResults {
    result: {
        winner: string,
        state: string
    };
    room: string;
    game_points: {
        playerX: number,
        playerO: number,
    };
}