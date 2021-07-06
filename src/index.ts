import { Timer } from './util';
import player from './player';
import {
    goal,
    height,
    keyboard,
    mapBackgroundCanvas,
    maze,
    obstacles,
    start,
    width,
} from './store';
import map from './map';

import { drawMap, drawPlayer } from './draw';

const timer = new Timer();

const fps = 144;

const delay = 1000 / fps;

const fpsDisplay = document.getElementById('fps')!;
const posDisplay = document.getElementById('player-pos')!;
const actualPosDisplay = document.getElementById('player-actual-pos')!;
const goalEstimateDisplay = document.getElementById('player-estimate')!;

let t = 0;

window.onload = async function (): Promise<void> {
    console.log('Load ok');

    mapBackgroundCanvas.drawImage(maze, 0, 0);

    // Set static obstacles
    map.set(mapBackgroundCanvas.getImageData(0, 0, width, height).data);

    // Draw goal to map background
    mapBackgroundCanvas.fillStyle = '#0000FF';
    mapBackgroundCanvas.beginPath();
    mapBackgroundCanvas.arc(goal.x, goal.y, 2, 0, 2 * Math.PI);
    mapBackgroundCanvas.fill();

    map.reset();
    console.log('starting...');

    init();
};

async function update(): Promise<void> {
    timer.start();

    obstacles.update();

    map.reset();

    // const dy = (keyboard.s ? -1 : 0) + (keyboard.w ? 1 : 0);
    // const dx = (keyboard.d ? -1 : 0) + (keyboard.a ? 1 : 0);

    await player.update(start.x, start.y);

    draw(update);
}

function draw(next: () => void): void {
    drawMap();

    drawPlayer();

    posDisplay.innerText = `memory x: ${player.x}, y: ${player.y}`;

    goalEstimateDisplay.innerText = player.goal ? `x: ${player.goal.x}, y: ${player.goal.y}` : 'searching';

    actualPosDisplay.innerText = `actual x: ${player.x + start.x}, y: ${player.y + start.y}`;

    t = timer.end();

    setTimeout(next, delay - t); // fixme loop
}

// FPS
// setInterval(() => (fpsDisplay.innerText = t + ' ms per cycle'), 100);
setInterval(() => (fpsDisplay.innerText = 'fps ' + Math.floor(1000 / t)), 100);

let begin = false;

document.addEventListener('keydown', ({ key }) => {
    if (key === ' ' && !begin) begin = true;
});

function init(): void {
    const dy = (keyboard.s ? -1 : 0) + (keyboard.w ? 1 : 0);
    const dx = (keyboard.d ? -1 : 0) + (keyboard.a ? 1 : 0);

    // player.x += dx;
    // player.y += dy;
    start.x += dx;
    start.y += dy;

    if (begin) draw(update);
    else draw(init);
}
