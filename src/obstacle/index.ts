import { cos, sin } from '../util';

export default class Obstacle {
    x: number;
    y: number;
    private dir: number;
    private readonly rx: number;
    private readonly ry: number;
    private readonly length: number;

    constructor(x = 250, y = 250, length = 30, dir = 0) {
        this.x = x + length;
        this.y = y + length;
        this.rx = x;
        this.ry = y;
        this.dir = dir;
        this.length = length;
    }

    update(): { x: number; y: number } {
        this.dir++;
        if (this.dir >= 360) this.dir = 0;

        const { dir } = this;

        const x = this.length;
        const y = 0;

        this.x = this.rx + Math.round(x * cos(dir) - y * sin(dir));
        this.y = this.ry + Math.round(x * sin(dir) + y * cos(dir));

        return { x: this.x, y: this.y };
    }
}
