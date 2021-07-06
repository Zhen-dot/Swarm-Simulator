type Edge = {
    priority: number;
    value: any;
    left: Edge | null;
    right: Edge | null;
};

let root: Edge | null = null;
let size = 0;

function merge(i: Edge | null, j: Edge | null): Edge {
    let r: Edge;

    if (i === null) return j!;
    if (j === null) return i!;

    if (i.priority < j.priority) {
        r = i;
        i = j;
        j = r;
    }

    i.right = merge(i.right, j);
    r = i.right;
    i.right = i.left;
    i.left = r;

    return i;
}

export function enqueue(priority: number, value: any): void {
    root = merge(root, {
        priority,
        value,
        left: null,
        right: null,
    });
    size++;
}

export function dequeue(): any {
    if (size) {
        const r = root!.value;
        root = merge(root!.left, root!.right);
        size--;
        return r;
    }
    throw Error('Empty heap; No item to dequeue');
}
