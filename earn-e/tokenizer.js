const canvas = document.getElementById('void')
const ctx = canvas.getContext('2d')

// Get window dimensions
const windowWidth = window.innerWidth
const windowHeight = window.innerHeight

// Set canvas dimensions to match viewport
canvas.width = windowWidth
canvas.height = windowHeight

// Define radius and center coordinates
const radius = 50
const bias = 100
const centerX = canvas.width / 2
const centerY = canvas.height / 2

function drawAtom(x, y, text) {

    // always print data to console
    // console.log(x, y, text)

    // Check if atom would be partially off-screen, considering radius
    if (
        x - radius < 0 ||
        x + radius > canvas.width ||
        y - radius < 0 ||
        y + radius > canvas.height
    ) {
        // Generate new random coordinates within bounds
        x = Math.random() * (canvas.width - radius * 2) + radius
        y = Math.random() * (canvas.height - radius * 2) + radius
    }

    // Draw the atom shape (filled circle)
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = 'lightblue'
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

const atoms = {} // Object to store atoms

function drawAtoms() {
    ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas
    Object.entries(atoms).forEach(([i, value]) => {
        try {
            // Calculate repulsion forces from other atoms
            let repulsionX = 0
            let repulsionY = 0
            Object.entries(atoms).forEach(([j, value]) => {
                if (i !== j) { // Don't calculate repulsion with itself
                    const otherAtom = atoms[j]
                    const distanceX = atoms[i].x - otherAtom.x
                    const distanceY = atoms[i].y - otherAtom.y
                    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
        
                    // Apply repulsion force inversely proportional to distance
                    const buffer = bias
                    if (distance < radius * 2 + buffer) { // Only apply repulsion if within overlap range
                        const force = Math.max(buffer, (radius * 2 - distance) / 5)
                        repulsionX += force * distanceX / distance
                        repulsionY += force * distanceY / distance
                    }
                }
                // Update atom's position with repulsion
                atoms[i].x += repulsionX
                atoms[i].y += repulsionY

                // Keep atom within canvas boundaries
                atoms[i].x = Math.max(radius, Math.min(atoms[i].x, canvas.width - radius))
                atoms[i].y = Math.max(radius, Math.min(atoms[i].y, canvas.height - radius))

                // Draw the atom with its adjusted position
                drawAtom(atoms[i].x, atoms[i].y, atoms[i].text)
                }
            )
        }
        catch {
            // pass
        }
    })
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

function animateAtoms() {
    requestAnimationFrame(animateAtoms) // Schedule the next animation frame
  
    drawAtoms() // Calculate repulsion and redraw atoms on every frame
}

async function cycleAtoms() {
    // Randomly generate atoms and store them in the array
    for (let i = 0; i < 9; i++) {
        const x = Math.random() * (canvas.width - radius * 2) + radius
        const y = Math.random() * (canvas.height - radius * 2) + radius
        atoms[i] = { x, y, text: 'atom-' + i }
    }
    await delay(6000)
    await cycleAtoms()
}

// start the animation loop
animateAtoms()

// update data
cycleAtoms()