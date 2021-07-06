import { MemoryChangeList } from '../../util';
import { Player } from '../../player';

type Node = {
    x: number;
    y: number;
    ds: number;
    dg: number;
    cost: number;
    parent?: Node;
};

const { sqrt } = Math;

let goal: { x: number; y: number };
let open: Node[];
let memory: MemoryChangeList;
let closed: MemoryChangeList;

export function init(player: Player, end: { x: number; y: number }): void {
    open = [];
    goal = end;
    memory = player.memory;
    closed = new MemoryChangeList();

    // console.log(open, goal, memory, closed);

    const { x, y } = player;

    const dg = dist({ x, y }, goal);
    open.push({
        x,
        y,
        ds: 0,
        dg,
        cost: dg,
    });
}

export function changes(): { row: number; col: number; value: number }[] {
    return closed.changes;
}

export function resetChanges(): void {
    closed.reset();
}

export function compute(): { x: number; y: number }[] | undefined {
    open.sort(maxCost);
    const parent = open.pop()!;

    const { x: px, y: py, ds: pds } = parent;

    closed.set(py, px, 1);

    // y - 1 to y + 1
    for (let y = py + 2; --y >= py - 1; ) {
        // x - 1 to x + 1
        for (let x = px + 2; --x >= px - 1; ) {
            const node = { x, y, parent };

            const col = memory.get(y, x);

            // Goal found
            if (x === goal.x && y === goal.y) return getPath(node, []);

            // Obstacle or Point already expanded
            if (col === 2 || closed.get(y, x) === 1) continue;

            // weighted
            const ds = pds * 0.95 + dist(node, parent);
            const dg = dist(node, goal);
            const cost = ds + dg;

            const o = openContains(node);

            if (o) {
                if (o.cost > cost) {
                    o.cost = cost;
                    o.ds = ds;
                    o.dg = dg;
                    o.parent = parent;
                }
            } else {
                open.push({ ...node, cost, ds, dg });
                // map[y][x] = 200;
            }
        }
    }
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return sqrt(dx * dx + dy * dy);
}

function maxCost(a: Node, b: Node): number {
    // return a.cost - b.cost || a.dg - b.dg; // min cost
    return b.cost - a.cost || b.dg - a.dg;
}

function getPath(
    node: { x: number; y: number; parent?: Node },
    path: { x: number; y: number }[]
): { x: number; y: number }[] {
    path.push(node);
    const { parent } = node;
    return parent ? getPath(parent, path) : path;
}

function openContains(node: { x: number; y: number }): Node | undefined {
    const { x, y } = node;

    // for (let i = 0, n = open.length; i < n; i++) {
    for (let i = open.length; --i >= 0; ) {
        const node = open[i];
        if (x === node.x && y === node.y) return node;
    }
}
