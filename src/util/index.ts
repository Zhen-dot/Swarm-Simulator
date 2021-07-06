export class Timer {
    private time = 0;

    constructor() {
        this.start();
    }

    start(): void {
        this.time = performance.now();
    }

    end(): number {
        return performance.now() - this.time;
    }
}

export function integrals(
    x0: number,
    y0: number,
    x1: number,
    y1: number
): { x: number; y: number }[] {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    const coordinates = [];

    while (true) {
        coordinates.push({ x: x0, y: y0 });

        if (x0 === x1 && y0 === y1) return coordinates;
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

const factor = Math.PI / 180;

export function cos(degrees: number): number {
    return Math.cos(degrees * factor);
}

export function sin(degrees: number): number {
    return Math.sin(degrees * factor);
}

export function dir(cx: number, cy: number, ex: number, ey: number): number {
    const dx = cx - ex;
    const dy = cy - ey;

    const theta = (Math.atan2(-dy, -dx) * 180) / Math.PI;

    return theta < 0 ? theta + 360 : theta;
}

export async function sleep(time = 0): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, time));
}

export function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function round(n: number, d = 2): number {
    return +n.toFixed(d);
}

export * from './memory';
