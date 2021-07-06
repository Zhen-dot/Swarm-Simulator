const goal = {
    x: -51,
    y: -50,
};

let index = 0;
let nodes: { x: number; y: number; parent?: number }[] = [];

function compute(): { x: number; y: number }[] | undefined {
    const { x, y } = nodes[index];
    for (let r = y - 1; r <= y + 1; r++) {
        for (let c = x - 1; c <= x + 1; c++) {
            const col = { x: c, y: r, parent: index };
            if (r === goal.y && c === goal.x) return getPath(index, [col]);

            if (!contains(col)) nodes.push(col);
        }
    }
    index++;
}

function getPath(parent: number, path: { x: number; y: number }[]): { x: number; y: number }[] {
    const node = nodes[parent];
    path.push(node);
    return node.parent ? getPath(node.parent, path) : path;
}

function contains(node: { x: number; y: number }): boolean {
    const { x, y } = node;

    // for (let i = 0, n = open.length; i < n; i++) {
    for (let i = nodes.length; --i >= 0; ) {
        const { x: nx, y: ny } = nodes[i];
        if (x === nx && y === ny) return true;
    }
    return false;
}

export default function init(initial: { x: number; y: number }): void {
    index = 0;
    nodes = [initial];
    const start = performance.now();
    while (true) {
        const path = compute();
        if (path) {
            console.log(performance.now() - start);
            console.log(path);
            break;
        }
    }
}
for (let i = 0; i < 10; i++) {
    init({ x: 0, y: 0 });
}
