import { goal, height, obstacles, width } from '../store';

interface View extends Array<Array<number>> {
    data: number[];

    dir: number;

    reset(): void;

    set(data: Uint8ClampedArray): void;
}

const map: View = Object.assign(
    new Array(height).fill(0).map(() => new Array(width).fill(0)),
    {
        data: [] as number[],
        dir: 0,
        reset: function () {
            const { data } = this;

            // Static obstacles
            for (let r = 0, n = height; r < n; r++) {
                for (let c = 0, n = width; c < n; c++) map[r][c] = +!data[r * width + c];
            }

            // Dynamic obstacles
            for (let i = 0, n = obstacles.length; i < n; i++) {
                const { x, y } = obstacles[i];
                map[y][x] = 1;
            }

            // Goal in map
            map[goal.y][goal.x] = 100;
        },
        set(data: Uint8ClampedArray) {
            this.data = Array.from(data.filter((v, i) => i % 4 === 0));
        },
    }
);

export default map;
