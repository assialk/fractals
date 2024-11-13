const canvas = document.getElementById("fractalCanvas");
const ctx = canvas.getContext("2d");
const fractalTypeSelect = document.getElementById("fractalType");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let zoom = 200;
let scale = 1; // Scaling factor
let offsetX = -canvas.width / 2;
let offsetY = -canvas.height / 2;
let centerX = -0.7, centerY = 0;

let isZooming = false;
let initialDistance = 0;
let lastMidpoint = { x: canvas.width / 2, y: canvas.height / 2 };

function getColor(iter, maxIter) {
    const hue = (iter / maxIter) * 360;
    const lightness = iter === maxIter ? 0 : 50 + (iter / maxIter) * 50;
    return `hsl(${hue}, 100%, ${lightness}%)`;
}

function drawMandelbrot() {
    const maxIter = 150;
    const width = canvas.width;
    const height = canvas.height;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let a = (x + offsetX) / zoom + centerX;
            let b = (y + offsetY) / zoom + centerY;
            let ca = a, cb = b;
            let iter = 0;

            while (iter < maxIter) {
                const aa = a * a - b * b;
                const bb = 2 * a * b;
                a = aa + ca;
                b = bb + cb;
                if (a * a + b * b > 16) break;
                iter++;
            }

            ctx.fillStyle = getColor(iter, maxIter);
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

// Other fractal drawing functions remain unchanged...

function drawFractal() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    zoom *= scale; // Apply smooth scaling to zoom level
    scale = 1; // Reset scale after applying

    const fractalType = fractalTypeSelect.value;
    switch (fractalType) {
        case "mandelbrot":
            drawMandelbrot();
            break;
        case "julia":
            drawJulia();
            break;
        case "sierpinski":
            drawSierpinski();
            break;
    }
}

// Pinch-to-zoom functionality
canvas.addEventListener("touchstart", (event) => {
    if (event.touches.length === 2) {
        isZooming = true;
        initialDistance = getDistance(event.touches[0], event.touches[1]);
        lastMidpoint = getMidpoint(event.touches[0], event.touches[1]);
    }
});

canvas.addEventListener("touchmove", (event) => {
    if (isZooming && event.touches.length === 2) {
        const newDistance = getDistance(event.touches[0], event.touches[1]);
        scale = newDistance / initialDistance;

        const newMidpoint = getMidpoint(event.touches[0], event.touches[1]);
        offsetX += (lastMidpoint.x - newMidpoint.x);
        offsetY += (lastMidpoint.y - newMidpoint.y);
        lastMidpoint = newMidpoint;

        drawFractal();
    }
});

canvas.addEventListener("touchend", (event) => {
    if (event.touches.length < 2) {
        isZooming = false;
    }
});

// Utility functions for pinch-to-zoom
function getDistance(touch1, touch2) {
    return Math.sqrt(
        (touch1.clientX - touch2.clientX) ** 2 + 
        (touch1.clientY - touch2.clientY) ** 2
    );
}

function getMidpoint(touch1, touch2) {
    return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
    };
}

// Initial draw
drawFractal();
