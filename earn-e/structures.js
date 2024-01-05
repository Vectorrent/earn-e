// Base radius of atoms
const baseRadius = 44;
const scalingFactor = 0.01
const bias = 100;

// Set up parameters for oscillation, vibration, and blur
const minFieldStrength = 0.01;
const maxFieldStrength = 5;
const oscillationSpeed = 0.001;
const clarityBias = 0.8;

// Control forces
const damping = 0.01;
const tolerance = 1;
const repulsionStrength = 0.1;

 // Adjust the angle for text projection
const rotation = -2
const angle = 0

// Check if inversion is needed and set the filter accordingly
const colors = {
    white: { filter: "none", bodyBackground: "white" },
    black: { filter: "invert(100%)", bodyBackground: "black" },
};
let colorScheme = 'white'

// Monte Carlo simulation
let heads = {};
let tails = {};

const canvas = document.getElementById('void');
const ctx = canvas.getContext('2d');
canvas.classList.add('overlay');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

function drawAtom(x, y, z, text) {
    const scaledRadius = baseRadius / (1 + z * scalingFactor);

    // Calculate color based on z value
    const colorCycle = Math.sin(z * 0.1); // Sine wave for color oscillation
    const blueChannel = Math.floor(255 * (0.5 - 0.5 * colorCycle));
    const redChannel = Math.floor(255 * (0.5 + 0.5 * colorCycle));

    // Draw the line to the center of the canvas (behind the atom)
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(centerX, centerY);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Draw the atom shape (filled circle) with scaled radius and calculated color
    ctx.beginPath();
    ctx.arc(x, y, scaledRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${redChannel}, 0, ${blueChannel})`;
    ctx.fill();

    // Draw the outline of the atom
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Project curved text on the atom's surface
    const textRadius = scaledRadius + rotation;
    const textAngle = -Math.PI / angle;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(textAngle);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Create a halo effect around the atoms
    ctx.beginPath();
    ctx.arc(0, 0, textRadius, 0, Math.PI, true);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    ctx.fillText(text, -textRadius, 0);
    ctx.restore();
}

let splitAngle = Math.random() * Math.PI * 2; // Random angle in radians

function drawAtoms() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.style.filter = colors[colorScheme].filter;
    document.body.style.backgroundColor = colors[colorScheme].bodyBackground;

    // Draw connections and atoms in a recurring pattern
    for (let i = 0; i < Object.keys(heads).length; i++) {
        const atom = heads[i];
        const colorCycle = Math.sin(atom.z * 0.1);
        const blueChannel = Math.floor(255 * (0.5 - 0.5 * colorCycle));

        // Draw connecting lines
        synapseLines.forEach(line => {
            const atom1Blue = isAtomBlue(line.atom1.z);
            const atom2Blue = isAtomBlue(line.atom2.z);

            if (atom1Blue && atom2Blue) {
                drawSynapseLine(line.atom1.x, line.atom1.y, line.atom2.x, line.atom2.y);
            } else if (atom1Blue) {
                drawSynapseLine(
                    line.atom1.x, line.atom1.y,
                    line.atom2.x + (line.atom2.x - line.atom1.x) * baseRadius / (baseRadius * 2),
                    line.atom2.y + (line.atom2.y - line.atom1.y) * baseRadius / (baseRadius * 2)
                );
            } else if (atom2Blue) {
                drawSynapseLine(
                    line.atom1.x + (line.atom1.x - line.atom2.x) * baseRadius / (baseRadius * 2),
                    line.atom1.y + (line.atom1.y - line.atom2.y) * baseRadius / (baseRadius * 2),
                    line.atom2.x, line.atom2.y
                );
            } else {
                drawSynapseLine(line.atom1.x, line.atom1.y, line.atom2.x, line.atom2.y);
            }
        });

        // Draw the atom
        if (blueChannel === 0) {
            drawAtom(atom.x, atom.y, atom.z, atom.text);
        }
    }

    // Draw blue atoms after lines
    for (let i = 0; i < Object.keys(heads).length; i++) {
        const atom = heads[i];
        const colorCycle = Math.sin(atom.z * 0.1);
        const blueChannel = Math.floor(255 * (0.5 - 0.5 * colorCycle));

        // Draw connecting lines
        synapseLines.forEach(line => {
            const atom1Blue = isAtomBlue(line.atom1.z);
            const atom2Blue = isAtomBlue(line.atom2.z);

            if (atom1Blue && atom2Blue) {
                drawSynapseLine(line.atom1.x, line.atom1.y, line.atom2.x, line.atom2.y);
            } else if (atom1Blue) {
                drawSynapseLine(
                    line.atom1.x, line.atom1.y,
                    line.atom2.x + (line.atom2.x - line.atom1.x) * baseRadius / (baseRadius * 2),
                    line.atom2.y + (line.atom2.y - line.atom1.y) * baseRadius / (baseRadius * 2)
                );
            } else if (atom2Blue) {
                drawSynapseLine(
                    line.atom1.x + (line.atom1.x - line.atom2.x) * baseRadius / (baseRadius * 2),
                    line.atom1.y + (line.atom1.y - line.atom2.y) * baseRadius / (baseRadius * 2),
                    line.atom2.x, line.atom2.y
                );
            } else {
                drawSynapseLine(line.atom1.x, line.atom1.y, line.atom2.x, line.atom2.y);
            }
        });

        // Draw the atom
        if (blueChannel !== 0) {
            drawAtom(atom.x, atom.y, atom.z, atom.text);
        }
    }
}

function drawSynapseLine(x1, y1, x2, y2) {
    const atom1Depth = getAtomDepth(x1, y1);
    const atom2Depth = getAtomDepth(x2, y2);

    // Calculate the direction from atom1 to atom2
    const directionX = x2 - x1;
    const directionY = y2 - y1;

    // Calculate the distance between atoms
    const distance = Math.sqrt(directionX ** 2 + directionY ** 2);

    // Normalize the direction vector
    const normalizedDirectionX = directionX / distance;
    const normalizedDirectionY = directionY / distance;

    // Calculate the position for the left atom's edge
    const leftEdgeX = x1 + (baseRadius * normalizedDirectionX);
    const leftEdgeY = y1 + (baseRadius * normalizedDirectionY);

    // Calculate the position for the right atom's center
    const rightCenterX = x2 - (0.5 * baseRadius * normalizedDirectionX);
    const rightCenterY = y2 - (0.5 * baseRadius * normalizedDirectionY);

    ctx.beginPath();

    // Draw the line starting from the left atom's edge to the right atom's center
    if (atom1Depth <= atom2Depth) {
        ctx.moveTo(leftEdgeX, leftEdgeY);
        ctx.lineTo(rightCenterX, rightCenterY);
    } else {
        ctx.moveTo(rightCenterX, rightCenterY);
        ctx.lineTo(leftEdgeX, leftEdgeY);
    }

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function getAtomDepth(x, y) {
    // This function returns the depth (z-axis value) of the atom at the specified coordinates
    // You can implement the logic to retrieve the depth from the heads object or any other data structure

    // For now, assuming heads object contains atom details
    const atom = getNearestAtom(x, y);
    return atom ? atom.z : 0; // Return 0 if atom not found (adjust as needed)
}

function getNearestAtom(x, y) {
    // This function returns the nearest atom to the specified coordinates
    // You can implement the logic to find the nearest atom from the heads object or any other data structure

    // For now, assuming heads object contains atom details
    let nearestAtom = null;
    let minDistance = Infinity;

    Object.entries(heads).forEach(([i, value]) => {
        const atom = heads[i];
        const distance = Math.sqrt((x - atom.x) ** 2 + (y - atom.y) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
            nearestAtom = atom;
        }
    });

    return nearestAtom;
}

function isAtomBlue(z) {
    // Your logic to determine if the atom based on its z value is blue
    // You can use the color calculation from drawAtoms function as a basis
    const colorCycle = Math.sin(z * 0.1);
    const blueChannel = Math.floor(255 * (0.5 - 0.5 * colorCycle));
    return blueChannel > 0; // Adjust threshold if needed
}

function moveAtomLinear(old_x, old_y, new_x, new_y, damping) {
    const dx = (new_x - old_x) * damping;
    const dy = (new_y - old_y) * damping;

    const updated_x = old_x + dx;
    const updated_y = old_y + dy;

    return { x: updated_x, y: updated_y };
}

function getRandomInt(min, max) {
    // Ensure min is smaller than max
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random number within a range
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Store a list of currently active synapse lines
let activeSynapseLines = [];
let synapseLines = [];
let frameCount = 0;

function animateAtoms() {
    requestAnimationFrame(animateAtoms);
    drawAtoms();

    // Draw active synapse lines
    activeSynapseLines.forEach(({ atom1, atom2 }) => {
        drawSynapseLine(atom1.x, atom1.y, atom2.x, atom2.y);
    });

    frameCount++;

    // Rotate synapse connections every few seconds
    const roll = getRandomInt(6, 66)
    if (frameCount % roll === 0) {
        activeSynapseLines = []; // Clear existing synapse lines

        // Choose a random number of synapse pairs (2-4)
        const numSynapses = Math.floor(Math.random() * 3) + 2;

        // Generate unique synapse pairs
        const synapsePairs = [];
        while (synapsePairs.length < numSynapses) {
            const atom1Index = Math.floor(Math.random() * Object.keys(heads).length);
            const atom2Index = Math.floor(Math.random() * Object.keys(heads).length);

            const pair = [atom1Index, atom2Index].sort(); // Ensure order doesn't matter
            if (!synapsePairs.includes(pair)) {
                synapsePairs.push(pair);
            }
        }

        // Create synapse lines for the chosen pairs
        synapsePairs.forEach(([atom1Index, atom2Index]) => {
            const atom1 = heads[atom1Index];
            const atom2 = heads[atom2Index];

            activeSynapseLines.push({ atom1, atom2 });
            drawSynapseLine(atom1.x, atom1.y, atom2.x, atom2.y);
        });
    }
}

// Function to calculate the SILU (Sigmoid-weighted Linear Unit) function
function silu(x) {
  return x * (1 / (1 + Math.exp(-x)));
}

// Animation loop
function animateFieldStrength() {
  const currentTime = new Date().getTime();
  const oscillationValue = Math.sin(currentTime * oscillationSpeed);

  // Calculate the SILU-weighted blur strength
  const blurStrength = silu(oscillationValue) * (5.0 - 0.1) + 0.1 * clarityBias;

  // Apply the calculated blur strength to the canvas
  canvas.style.filter = `blur(${blurStrength}px)`;

  // Request the next animation frame
  requestAnimationFrame(animateFieldStrength);
}

// Start the animation loop
animateFieldStrength();

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

    Object.entries(heads).forEach(([i, value]) => {
        let repulsionX = 0;
        let repulsionY = 0;

        Object.entries(heads).forEach(([j, value]) => {
            if (i !== j) {
                const atom1 = heads[i];
                const atom2 = heads[j];
                const depth1 = atom1.z;
                const depth2 = atom2.z;

                // Draw connection if one atom is in front of the other
                if ((depth1 > depth2 && isAtomBlue(atom1.z)) || (depth1 < depth2 && !isAtomBlue(atom1.z))) {
                    drawSynapseLine(atom1.x, atom1.y, atom2.x, atom2.y);
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

// Function to cycle through color schemes
function cycleColorScheme() {
    const schemeNames = Object.keys(colors); // Get names of available schemes
    const currentIndex = schemeNames.indexOf(colorScheme);
    colorScheme = schemeNames[(currentIndex + 1) % schemeNames.length]; // Move to the next scheme
    drawAtoms();
}

// Add a click listener to the center of the screen
const clickRadius = Math.min(window.innerWidth, window.innerHeight) * 0.23; // 10% of viewport size

document.addEventListener("click", (event) => {
    const distanceFromCenter = Math.sqrt(
        Math.pow(event.pageX - centerX, 2) + Math.pow(event.pageY - centerY, 2)
    );

    if (distanceFromCenter <= clickRadius) {
        cycleColorScheme();
    }
});

animateAtoms();
cycleAtoms();