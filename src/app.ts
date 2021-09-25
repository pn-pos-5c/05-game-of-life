class Main {
    private board: boolean[][] = [];
    private calcBoard: boolean[][] = [];

    private boardWidth: number = 0;
    private boardHeight: number = 0;

    initBoard(width: number, height: number) {
        this.boardWidth = width;
        this.boardHeight = height;

        for (let x = 0; x < width; x++) {
            const row: boolean[] = [];
            this.board.push(row);

            const calcRow: boolean[] = [];
            this.calcBoard.push(calcRow);

            for (let y = 0; y < height; y++) {
                row.push(Math.random() * 101 <= 3);
                calcRow.push(false);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, pixelSize: number): void {
        this.calcNeighbors();

        this.board = JSON.parse(JSON.stringify(this.calcBoard));

        ctx.clearRect(0, 0, this.boardWidth * pixelSize, this.boardHeight * pixelSize);

        for (let x = 0; x < this.boardWidth; x++) {
            for (let y = 0; y < this.boardHeight; y++) {
                if (this.board[x][y]) ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }

        window.requestAnimationFrame(() => this.draw(ctx, pixelSize));
    }

    alive(x: number, y: number): number {
        if (x < 0 || y < 0 || x >= this.boardWidth || y >= this.boardHeight) {
            return 0;
        }

        return this.board[x][y] ? 1 : 0;
    }

    calcNeighbors(): void {
        for (let x = 0; x < this.boardWidth; x++) {
            for (let y = 0; y < this.boardHeight; y++) {
                const neighbors =
                    this.alive(x - 1, y - 1) + this.alive(x - 1, y) + this.alive(x - 1, y + 1) +
                    this.alive(x, y - 1) + this.alive(x, y + 1) +
                    this.alive(x + 1, y - 1) + this.alive(x + 1, y) + this.alive(x + 1, y + 1);

                if (neighbors < 2 || neighbors > 3) {
                    this.calcBoard[x][y] = false;
                } else if (neighbors === 3) {
                    this.calcBoard[x][y] = true;
                } else {
                    this.calcBoard[x][y] = this.board[x][y];
                }
            }
        }
    }
}

window.onload = () => {
    const boardSize = 800;
    const pixelSize = 4;

    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    canvas.width = canvas.height = boardSize;
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';

    const main = new Main();
    main.initBoard(boardSize / pixelSize, boardSize / pixelSize);
    main.draw(ctx, pixelSize);
};
