import Obstacle from '../obstacle';

interface Obstacles extends Array<Obstacle> {
    update(): void;
}

export const obstacles: Obstacles = Object.assign([], {
    update(): void {
        for (let i = 0, n = obstacles.length; i < n; i++) obstacles[i].update();
    },
});
for (let i = 30; i < 50; i++) obstacles.push(new Obstacle(250, 250, i));
