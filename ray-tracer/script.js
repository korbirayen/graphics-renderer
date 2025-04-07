const canvas = document.getElementById('raytracerCanvas');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');

canvas.width = 512;
canvas.height = 512;

const aspectRatio = canvas.width / canvas.height;

const sphere = {
    center: [0, 0, -1],
    radius: 0.5,
    color: [1, 0, 0] // Red
};

const light = {
    direction: [0.5, 0.5, -1]
};

let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;
});

function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function multiply(a, scalar) {
    return [a[0] * scalar, a[1] * scalar, a[2] * scalar];
}

function normalize(a) {
    const length = Math.sqrt(dot(a, a));
    return [a[0] / length, a[1] / length, a[2] / length];
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            // Ray origin (from mouse)
            const rayOrigin = [
                (mouseX / canvas.width) * 2 - 1,
                -(mouseY / canvas.height) * 2 + 1,
                0
            ];

            // Ray direction
            let u = (x / canvas.width) * 2 - 1;
            let v = -(y / canvas.height) * 2 + 1;
            let rayDirection = [u - rayOrigin[0], (v - rayOrigin[1]) / aspectRatio, -1];
            rayDirection = normalize(rayDirection);

            // Sphere intersection
            const oc = subtract(rayOrigin, sphere.center);
            const a = dot(rayDirection, rayDirection);
            const b = 2 * dot(oc, rayDirection);
            const c = dot(oc, oc) - sphere.radius * sphere.radius;
            const discriminant = b * b - 4 * a * c;

            let color = [0, 0, 0]; // Black

            if (discriminant > 0) {
                // Intersection found
                const t = (-b - Math.sqrt(discriminant)) / (2 * a);
                const hitPoint = [
                    rayOrigin[0] + rayDirection[0] * t,
                    rayOrigin[1] + rayDirection[1] * t,
                    rayOrigin[2] + rayDirection[2] * t
                ];

                // Normal
                const normal = subtract(hitPoint, sphere.center);
                const normalLength = Math.sqrt(dot(normal, normal));
                const normalizedNormal = multiply(normal, 1 / normalLength);

                // Shadow
                const lightDirection = normalize(multiply(light.direction, -1));
                const shadowRayOrigin = hitPoint;
                const shadowRayDirection = lightDirection;

                const ocShadow = subtract(shadowRayOrigin, sphere.center);
                const aShadow = dot(shadowRayDirection, shadowRayDirection);
                const bShadow = 2 * dot(ocShadow, shadowRayDirection);
                const cShadow = dot(ocShadow, ocShadow) - sphere.radius * sphere.radius;
                const discriminantShadow = bShadow * bShadow - 4 * aShadow * cShadow;

                let inShadow = false;
                if (discriminantShadow > 0) {
                    inShadow = true;
                }

                // Light
                let lightIntensity = Math.max(0, dot(normalizedNormal, light.direction));
                if (inShadow) {
                    lightIntensity = 0.1; // Dim ambient light
                }

                // Color
                color = multiply(sphere.color, lightIntensity);
            }

            ctx.fillStyle = `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }

    info.textContent = `Mouse X: ${mouseX}, Mouse Y: ${mouseY}`;
    requestAnimationFrame(render);
}

render();
