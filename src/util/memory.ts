export class Memory {
    protected memory: Map<number, Map<number, number>>;

    constructor() {
        this.memory = new Map();
    }

    get(row: number, col: number): number | undefined {
        return this.memory.get(row)?.get(col);
    }

    set(row: number, col: number, value: number): void {
        const { memory } = this;

        if (!memory.has(row)) memory.set(row, new Map());

        memory.get(row)!.set(col, value);
    }

    rows(): number[] {
        return Array.from(this.memory.keys());
    }

    cols(row: number): number[] {
        return Array.from(this.memory.get(row)?.keys() || []);
    }

    del(row: number, col: number): void {
        this.memory.get(row)?.delete(col);
    }
}

export class MemoryChangeList extends Memory {
    changes: { row: number; col: number; value: number }[] = [];

    constructor() {
        super();
    }

    get(row: number, col: number): number | undefined {
        return this.memory.get(row)?.get(col);
    }

    set(row: number, col: number, value: number): void {
        const { memory, changes } = this;

        if (!memory.has(row)) memory.set(row, new Map());

        memory.get(row)!.set(col, value);
        changes.push({ row, col, value });
    }

    rows(): number[] {
        return Array.from(this.memory.keys());
    }

    cols(row: number): number[] {
        return Array.from(this.memory.get(row)?.keys() || []);
    }

    del(row: number, col: number): void {
        this.memory.get(row)?.delete(col);
    }

    reset(): void {
        // console.log(this.changes.length);
        this.changes = [];
    }
}
