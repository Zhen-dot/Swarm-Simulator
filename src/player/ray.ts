import map from '../map';
import { cos, sin } from '../util';

export default class Ray {
    readonly dir: number;
    integrals: { x: number; y: number }[] = [];
    private readonly dx: number;
    private readonly dy: number;

    constructor(dir: number, length = 100) {
        this.dir = dir;
        const x = length;
        const y = 0;

        this.dx = Math.round(x * cos(dir) - y * sin(dir));
        this.dy = Math.round(x * sin(dir) + y * cos(dir));
    }

    // Empty points; Collision point
    update(x: number, y: number): [boolean, { x: number; y: number }?, { x: number; y: number }?] {
        const [integrals, col, goal] = rayIntegrals(x, y, x + this.dx, y + this.dy);
        this.integrals = integrals;

        return [integrals.length === 0, col, goal];
    }
}

// Empty points; Collision point; Goal
function rayIntegrals(
    px: number,
    py: number,
    mx: number,
    my: number
): [{ x: number; y: number }[], { x: number; y: number }?, { x: number; y: number }?] {
    const dx = Math.abs(mx - px);
    const dy = Math.abs(my - py);
    const sx = px < mx ? 1 : -1;
    const sy = py < my ? 1 : -1;
    let err = dx - dy;

    const coordinates = [];

    while (true) {
        const row = map[py];
        const col = row?.[px];

        // Terminate on goal found
        if (col === 100) return [coordinates, undefined, { x: px, y: py }];

        /* Terminate on:
        Row out of bounds
        Col out of bounds
        Col is wall
         */
        if (col === undefined || col === 1) return [coordinates, { x: px, y: py }, undefined];

        // Terminate on max length reached; No collision
        if (px === mx && py === my) return [coordinates, undefined];

        coordinates.push({ x: px, y: py });
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            px += sx;
        }
        if (e2 < dx) {
            err += dx;
            py += sy;
        }
    }
}
