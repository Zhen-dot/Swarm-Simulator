import player from '../player';
import { cos, sin } from '../util';
import { height, mapMainCanvas, obstacles, width, start } from '../store';

export function drawMap(): void {
    mapMainCanvas.clearRect(0, 0, width, height);

    // Draw rays
    mapMainCanvas.strokeStyle = '#CDCDCD';

    const { rays, dir } = player;
    for (let r = 0, n = rays.length; r < n; r++) {
        const int = rays[r].integrals;

        if (int[0]) {
            mapMainCanvas.beginPath();
            mapMainCanvas.moveTo(int[0].x, int[0].y);
            mapMainCanvas.lineTo(int[int.length - 1].x, int[int.length - 1].y);
            mapMainCanvas.stroke();
        }
    }

    mapMainCanvas.fillStyle = '#000000';
    obstacles.forEach(({ x, y }) => {
        mapMainCanvas.fillRect(x, y, 1, 1);
        mapMainCanvas.fill();
    });

    const sx = player.x + start.x;
    const sy = player.y + start.y;

    // // Draw direction of goal
    // mapMainCanvas.strokeStyle = '#0000FF';
    // mapMainCanvas.beginPath();
    //

    //
    // const x = 100;
    // const y = 0;
    //
    // mapMainCanvas.moveTo(sx, sy);
    // mapMainCanvas.lineTo(
    //     sx + Math.round(x * cos(dir) - y * sin(dir)),
    //     sy + Math.round(x * sin(dir) + y * cos(dir))
    // );
    // mapMainCanvas.stroke();

    // Draw player
    mapMainCanvas.fillStyle = '#FF0000';
    mapMainCanvas.beginPath();
    mapMainCanvas.arc(sx, sy, 2, 0, 2 * Math.PI);
    mapMainCanvas.fill();
}
