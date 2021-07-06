import Ray from './ray';
import { goal } from '../store';
import * as pathfinder from '../pathfinder/a-star';
import { cos, dir, MemoryChangeList, randInt, sin, sleep } from '../util';
import { drawPlayerPath, resetPlayerPath } from '../draw';

class Player {
    // Memory layer
    memory: MemoryChangeList = new MemoryChangeList();

    // Map layer
    x: number;
    y: number;
    dir = 0;
    rays: Ray[] = [];
    path: { x: number; y: number }[] = [];
    goal?: { x: number; y: number };
    pathfinder: {
        init(player: Player, end: { x: number; y: number }): void;
        compute(): { x: number; y: number }[] | undefined;
    };
    goalDirections: { x: number; y: number; dir: number }[] = [];

    constructor(x = 0, y = 0, n = 360) {
        this.x = x;
        this.y = y;
        this.pathfinder = pathfinder;
        for (let i = 0; i < 360; i += 360 / n) this.rays.push(new Ray(i, 50));
    }

    findGoal(sx: number, sy: number): void {
        if (this.goalDirections.length > 10) {
            const x = 100;
            const y = 0;

            for (const { x: l1x1, y: l1y1, dir: l1dir } of this.goalDirections) {
                const l1x2 = l1x1 + Math.round(x * cos(l1dir) - y * sin(l1dir));
                const l1y2 = l1y1 + Math.round(x * sin(l1dir) + y * cos(l1dir));

                const a1 = l1y2 - l1y1;
                const b1 = l1x1 - l1x2;
                const c1 = a1 * l1x1 + b1 * l1y1;

                for (const { x: l2x1, y: l2y1, dir: l2dir } of this.goalDirections) {
                    const l2x2 = l2x1 + Math.round(x * cos(l2dir) - y * sin(l2dir));
                    const l2y2 = l2y1 + Math.round(x * sin(l2dir) + y * cos(l2dir));

                    const a2 = l2y2 - l2y1;
                    const b2 = l2x1 - l2x2;
                    const c2 = a2 * l2x1 + b2 * l2y1;

                    const d = a1 * b2 - a2 * b1;

                    // Parallel
                    if (d === 0) continue;

                    this.goal = {
                        x: Math.round((b2 * c1 - b1 * c2) / d),
                        y: Math.round((a1 * c2 - a2 * c1) / d),
                    };
                    return;
                }
            }
        }

        const { x, y, dir } = this;
        this.goalDirections.push({ x: x + sx, y: y + sy, dir });
        this.path.push({ x: x + randInt(-1, 1), y: y + randInt(-1, 1) });
    }

    async update(sx: number, sy: number): Promise<void> {
        // Update goal direction
        this.dir = dir(this.x + sx, this.y + sy, goal.x, goal.y);

        if (this.x + sx === this.goal?.x && this.y + sy === this.goal?.y) {
            this.goal = undefined;
            this.goalDirections = [];
        }

        if (!this.goal) this.findGoal(sx, sy);

        if (this.goal && this.path.length === 0) await this.computePath(sx, sy);

        const { x, y } = this.path.pop()!;

        this.x = x;
        this.y = y;

        const obstacles: { x: number; y: number }[] = [];

        const { rays, memory } = this;

        // Cast lidar
        for (let i = 0, n = rays.length; i < n; i++) {
            const ray = rays[i];
            const [collide, point, goal] = ray.update(this.x + sx, this.y + sy);

            // Set goal if found
            if (goal) {
                // Update goal estimate to actual position
                this.goal = goal;
                memory.set(goal.y - sy, goal.x - sx, 3);
            }

            // Undo movement if it will result in collision
            if (collide) {
                const { dir } = ray;
                const dx = Math.round(cos(dir) - sin(dir));
                const dy = Math.round(sin(dir) + cos(dir));
                this.path = [{ x: x + dx, y: y + dy }];

                return this.update(sx, sy);
            }

            // Add detected point
            if (point) obstacles.push(point);
        }

        memory.reset();

        // Set detected points in memory as discovered obstacles
        for (let i = 0, n = obstacles.length; i < n; i++) {
            const { x, y } = obstacles[i];
            if (memory.get(y - sy, x - sx) !== 2) memory.set(y - sy, x - sx, 2);
        }

        // Set integrals with no detection in memory as discovered free points
        for (let i = 0, n = rays.length; i < n; i++) {
            const { integrals } = rays[i];
            for (let j = 0, n = integrals.length; j < n; j++) {
                const { x, y } = integrals[j];
                if (memory.get(y - sy, x - sx) !== 1) memory.set(y - sy, x - sx, 1);
            }
        }

        // const { x = this.x, y = this.y } = pathFinder.update();
        // this.dx = Math.round((x - this.x) * cos(this.dir) - (y - this.y) * sin(this.dir));
        // this.dy = Math.round((x - this.x) * sin(this.dir) + (y - this.y) * cos(this.dir));
    }

    async computePath(sx: number, sy: number): Promise<void> {
        const { path, goal, pathfinder } = this;

        // Recompute path if goal is found and path is not initialised or problematic
        if (path.length === 0 && goal) {

            pathfinder.init(this, { x: goal.x - sx, y: goal.y - sy });
            resetPlayerPath();
            let path;
            while (!path) {
                path = pathfinder.compute();
                drawPlayerPath();
                await sleep();
            }
            this.path = path;
        }
    }
}

const player = new Player();

export default player;

export {Player};
