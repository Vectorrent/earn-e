const canvas = document.getElementById('void');
const ctx = canvas.getContext('2d');

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

canvas.width = windowWidth;
canvas.height = windowHeight;

const baseRadius = 50; // Base radius of atoms
const bias = 100;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

function drawAtom(x, y, z, text) {
    const scaledRadius = baseRadius / (1 + z * 0.01);

    // Linearly interpolate color based on z value
    const red = Math.floor(255 * (1 - z));
    const blue = Math.floor(255 * (1 + z));
    const green = Math.floor(255 * Math.abs(z));

    // Draw the atom shape (filled circle) with scaled radius and interpolated color
    ctx.beginPath();
    ctx.arc(x, y, scaledRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${red},${green},${blue})`;
    ctx.fill();

    // Draw the outline of the atom
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    // Draw the line to the center of the canvas
    ctx.moveTo(x, y);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();

    // Draw the text inside the atom
    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y + scaledRadius / 2);
}


function moveAtomLinear(old_x, old_y, new_x, new_y, damping) {
    const dx = (new_x - old_x) * damping;
    const dy = (new_y - old_y) * damping;

    const updated_x = old_x + dx;
    const updated_y = old_y + dy;

    return { x: updated_x, y: updated_y };
}

let heads = {};
let tails = {};
const damping = 0.01;
const tolerance = 1;

function drawAtoms() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.entries(heads).forEach(([i, value]) => {
        let repulsionX = 0;
        let repulsionY = 0;

        Object.entries(heads).forEach(([j, value]) => {
            if (i !== j) {
                const otherAtom = heads[j];
                const distanceX = heads[i].x - otherAtom.x;
                const distanceY = heads[i].y - otherAtom.y;
                const distanceZ = heads[i].z - otherAtom.z;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ);

                const buffer = bias;
                if (distance < baseRadius * 2 + buffer) {
                    const force = Math.max(buffer, (baseRadius * 2 - distance) / 5);
                    const repulsionForce = force * damping;
                    repulsionX += repulsionForce * distanceX / distance;
                    repulsionY += repulsionForce * distanceY / distance;
                }
            }
        });

        const moveResult = moveAtomLinear(heads[i].x, heads[i].y, heads[i].targetX, heads[i].targetY, damping);
        heads[i].x = moveResult.x + repulsionX;
        heads[i].y = moveResult.y + repulsionY;

        heads[i].x = Math.max(baseRadius, Math.min(heads[i].x, canvas.width - baseRadius));
        heads[i].y = Math.max(baseRadius, Math.min(heads[i].y, canvas.height - baseRadius));

        drawAtom(heads[i].x, heads[i].y, heads[i].z, heads[i].text);

        if (Math.abs(heads[i].x - heads[i].targetX) <= tolerance &&
            Math.abs(heads[i].y - heads[i].targetY) <= tolerance) {
            heads[i].targetX = Math.random() * (canvas.width - baseRadius * 2) + baseRadius;
            heads[i].targetY = Math.random() * (canvas.height - baseRadius * 2) + baseRadius;
        }
    });
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function animateAtoms() {
    requestAnimationFrame(animateAtoms);
    drawAtoms();
}

async function cycleAtoms() {
    const atoms = {};

    if (Object.keys(heads).length === 0) {
        for (let i = 0; i < 9; i++) {
            const startX = Math.random() * (canvas.width - baseRadius * 2) + baseRadius;
            const startY = Math.random() * (canvas.height - baseRadius * 2) + baseRadius;
            const startZ = Math.random() - 0.5;
            atoms[i] = {
                x: startX,
                y: startY,
                z: startZ,
                text: 'atom-' + i,
                targetX: startX,
                targetY: startY,
            };
        }
    } else {
        Object.entries(heads).forEach(([i, value]) => {
            const targetX = heads[i].x + Math.random() * 100 - 50;
            const targetY = heads[i].y + Math.random() * 100 - 50;
            const targetZ = heads[i].z + Math.random() * 2 - 1; // Adjust the range for more noticeable z movement
        
            atoms[i] = {
                x: heads[i].x,
                y: heads[i].y,
                z: targetZ,
                text: 'atom-' + i,
                targetX,
                targetY,
            };
        });
        
    }

    tails = { ...heads };
    heads = atoms;

    repulsionStrength = 0.1;

    Object.entries(heads).forEach(([i, value]) => {
        let repulsionX = 0;
        let repulsionY = 0;

        Object.entries(heads).forEach(([j, value]) => {
            if (i !== j) {
                const otherAtom = heads[j];
                const distanceX = heads[i].x - otherAtom.x;
                const distanceY = heads[i].y - otherAtom.y;
                const distanceZ = heads[i].z - otherAtom.z;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ);

                const buffer = bias;
                if (distance < baseRadius * 2 + buffer) {
                    const force = Math.max(buffer, (baseRadius * 2 - distance) / 5);
                    const repulsionForce = force * repulsionStrength;
                    repulsionX += repulsionForce * distanceX / distance;
                    repulsionY += repulsionForce * distanceY / distance;
                }
            }
        });

        const moveResult = moveAtomLinear(heads[i].x, heads[i].y, heads[i].targetX, heads[i].targetY, damping);
        heads[i].x = moveResult.x + repulsionX;
        heads[i].y = moveResult.y + repulsionY;

        heads[i].x = Math.max(baseRadius, Math.min(heads[i].x, canvas.width - baseRadius));
        heads[i].y = Math.max(baseRadius, Math.min(heads[i].y, canvas.height - baseRadius));

        drawAtom(heads[i].x, heads[i].y, heads[i].z, heads[i].text);

        if (Math.abs(heads[i].x - heads[i].targetX) <= tolerance &&
            Math.abs(heads[i].y - heads[i].targetY) <= tolerance) {
            heads[i].targetX = Math.random() * (canvas.width - baseRadius * 2) + baseRadius;
            heads[i].targetY = Math.random() * (canvas.height - baseRadius * 2) + baseRadius;
        }
    });

    await delay(6000);
    await cycleAtoms();
}

animateAtoms();
cycleAtoms();
