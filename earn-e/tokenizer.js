const canvas = document.getElementById('void')
const ctx = canvas.getContext('2d')

const windowWidth = window.innerWidth
const windowHeight = window.innerHeight

canvas.width = windowWidth
canvas.height = windowHeight

const radius = 50
const bias = 100
const centerX = canvas.width / 2
const centerY = canvas.height / 2

function drawAtom(x, y, text) {
    // Draw the atom shape (filled circle)
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = 'lightblue';
    ctx.fill()

    // Draw the outline of the atom
    ctx.lineWidth = 2
    ctx.strokeStyle = 'blue'
    ctx.stroke()

    // Draw the line to the center of the canvas
    ctx.moveTo(x, y)
    ctx.lineTo(centerX, centerY)
    ctx.stroke()

    // Draw the text inside the atom
    ctx.font = '14px sans-serif'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, x, y + radius / 2)
}

function moveAtomLinear(old_x, old_y, new_x, new_y, damping) {
    // Calculate the distance to move in each direction
    const dx = (new_x - old_x) * damping
    const dy = (new_y - old_y) * damping

    // Move the atom one step closer to its target
    const updated_x = old_x + dx
    const updated_y = old_y + dy

    return { x: updated_x, y: updated_y }
}

let heads = {}
let tails = {}

function drawAtoms() {
    const damping = 0.01 // Adjust as needed for smoothness
    const tolerance = 1

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    Object.entries(heads).forEach(([i, value]) => {
        let repulsionX = 0
        let repulsionY = 0

        Object.entries(heads).forEach(([j, value]) => {
            if (i !== j) {
                const otherAtom = heads[j]
                const distanceX = heads[i].x - otherAtom.x
                const distanceY = heads[i].y - otherAtom.y
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

                const buffer = bias
                if (distance < radius * 2 + buffer) {
                    const force = Math.max(buffer, (radius * 2 - distance) / 5)
                    const repulsionForce = force * damping; // Apply damping to repulsion force
                    repulsionX += repulsionForce * distanceX / distance
                    repulsionY += repulsionForce * distanceY / distance
                }
            }
        })

        const moveResult = moveAtomLinear(heads[i].x, heads[i].y, heads[i].targetX, heads[i].targetY, damping)
        heads[i].x = moveResult.x + repulsionX
        heads[i].y = moveResult.y + repulsionY

        heads[i].x = Math.max(radius, Math.min(heads[i].x, canvas.width - radius))
        heads[i].y = Math.max(radius, Math.min(heads[i].y, canvas.height - radius))

        drawAtom(heads[i].x, heads[i].y, heads[i].text)

        if (Math.abs(heads[i].x - heads[i].targetX) <= tolerance &&
            Math.abs(heads[i].y - heads[i].targetY) <= tolerance) {
            heads[i].targetX = Math.random() * (canvas.width - radius * 2) + radius
            heads[i].targetY = Math.random() * (canvas.height - radius * 2) + radius
        }
    })
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

function animateAtoms() {
    requestAnimationFrame(animateAtoms)
    drawAtoms()
}

async function cycleAtoms() {
    const atoms = {}

    // If heads is empty, initialize it with default values
    if (Object.keys(heads).length === 0) {
        for (let i = 0; i < 9; i++) {
            const startX = Math.random() * (canvas.width - radius * 2) + radius;
            const startY = Math.random() * (canvas.height - radius * 2) + radius;
            atoms[i] = {
                x: startX,
                y: startY,
                text: 'atom-' + i,
                targetX: startX,
                targetY: startY,
            };
        }
    } else {
        Object.entries(heads).forEach(([i, value]) => {
            // Generate new target positions nearby the current positions
            const targetX = heads[i].x + Math.random() * 100 - 50 // Adjust the range as needed
            const targetY = heads[i].y + Math.random() * 100 - 50 // Adjust the range as needed

            atoms[i] = {
                x: heads[i].x,
                y: heads[i].y,
                text: 'atom-' + i,
                targetX,
                targetY,
            }
        })
    }

    tails = { ...heads }
    heads = atoms

    await delay(6000)
    await cycleAtoms()
}

animateAtoms()
cycleAtoms()
