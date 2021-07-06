export const maze = new Image();
maze.src = 'assets/maze.png';

export const width = maze.width;
export const height = maze.height;

export const start = {
    x: 100,
    y: 100,
}

export const goal = {
    x: 250,
    y: 250,
};

export * from './canvas';

export * from './obstacles';
