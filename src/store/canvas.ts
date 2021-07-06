export const mapBackgroundCanvas = (
    document.getElementById('map-background-layer') as HTMLCanvasElement
).getContext('2d')!;
mapBackgroundCanvas.imageSmoothingEnabled = false;

export const mapMainCanvas = (
    document.getElementById('map-main-layer') as HTMLCanvasElement
).getContext('2d')!;
mapMainCanvas.imageSmoothingEnabled = false;

export const playerMainCanvas = (
    document.getElementById('player-main-layer') as HTMLCanvasElement
).getContext('2d')!;
playerMainCanvas.imageSmoothingEnabled = false;

export const playerPathCanvas = (
    document.getElementById('player-path-layer') as HTMLCanvasElement
).getContext('2d')!;
playerPathCanvas.imageSmoothingEnabled = false;

export const keyboard = {
    w: false,
    a: false,
    s: false,
    d: false,
};

document.addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keyboard.w = true;
            break;
        case 'a':
            keyboard.a = true;
            break;
        case 's':
            keyboard.s = true;
            break;
        case 'd':
            keyboard.d = true;
            break;
    }
});

document.addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
            keyboard.w = false;
            break;
        case 'a':
            keyboard.a = false;
            break;
        case 's':
            keyboard.s = false;
            break;
        case 'd':
            keyboard.d = false;
            break;
    }
});
