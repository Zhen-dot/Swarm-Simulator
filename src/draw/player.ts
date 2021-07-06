import player from '../player';
import { changes, resetChanges } from '../pathfinder/a-star';
import {
    height,
    playerMainCanvas,
    playerPathCanvas,
    start,
    width,
} from '../store';

const playerMainImageData = playerMainCanvas.createImageData(width + 2, height + 2);
let playerPathImageData = playerPathCanvas.createImageData(width + 2, height + 2);
const w = (width + 2) * 4;

export function drawPlayer(): void {
    const dy = start.y + 1;
    const dx = start.x + 1;
    const { changes } = player.memory;
    const { data } = playerMainImageData;

    let goal: { x: number; y: number } | undefined;

    for (let i = 0, n = changes.length; i < n; i++) {
        const { row, col, value } = changes[i];
        const p = (row + dy) * w + (col + dx) * 4;

        switch (value) {
            case 1:
                // Empty point
                data[p] = 50;
                data[p + 1] = 205;
                data[p + 2] = 50;
                break;
            case 2:
                // Obstacle
                data[p] = 0;
                data[p + 1] = 0;
                data[p + 2] = 0;
                break;
            case 3:
                // Goal
                data[p] = 0;
                data[p + 1] = 0;
                data[p + 2] = 255;
                goal = { x: col, y: row };
                break;
        }

        data[p + 3] = 255;
    }
    playerMainCanvas.putImageData(playerMainImageData, 0, 0);

    // Draw player
    playerMainCanvas.fillStyle = '#FF0000';
    playerMainCanvas.beginPath();
    playerMainCanvas.arc(player.x + dx, player.y + dy, 2, 0, 2 * Math.PI);
    playerMainCanvas.fill();

    // Draw goal
    if (goal) {
        playerMainCanvas.fillStyle = '#0000FF';
        playerMainCanvas.beginPath();
        playerMainCanvas.arc(goal.x + dx, goal.y + dy, 2, 0, 2 * Math.PI);
        playerMainCanvas.fill();
    }
}

export function resetPlayerPath(): void {
    playerPathImageData = playerPathCanvas.createImageData(width + 2, height + 2);
}

export function drawPlayerPath(): void {
    const dy = start.y + 1;
    const dx = start.x + 1;
    const { data } = playerPathImageData;

    const nodes = changes();
    for (let i = 0, n = nodes.length; i < n; i++) {
        const { row, col, value } = nodes[i];
        const p = (row + dy) * w + (col + dx) * 4;

        switch (value) {
            case 1:
                // Closed node
                data[p] = 255;
                // data[p + 1] = 0;
                // data[p + 2] = 0;
                break;
            case 2:
                // Path node
                // data[p] = 0;
                data[p + 1] = 255;
                // data[p + 2] = 0;
                break;
        }

        data[p + 3] = 255;
    }
    playerPathCanvas.putImageData(playerPathImageData, 0, 0);
    resetChanges();
}
