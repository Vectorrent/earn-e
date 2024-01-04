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

// // Randomly generate coordinates and draw initial atoms
// for (let i = 0; i < 9; i++) {
//     const x = Math.random() * (canvas.width - radius * 2) + radius // Adjust for radius
//     const y = Math.random() * (canvas.height - radius * 2) + radius
//     drawAtom(x, y, 'atom-' + i)
// }

const atoms = []; // Array to store atom objects

function animateAtoms() {
    requestAnimationFrame(animateAtoms); // Schedule the next animation frame
  
    drawAtoms(); // Calculate repulsion and redraw atoms on every frame
}

function drawAtoms() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Iterate through each atom and adjust its position based on repulsion
  for (let i = 0; i < atoms.length; i++) {
    const atom = atoms[i];

    // Calculate repulsion forces from other atoms
    let repulsionX = 0;
    let repulsionY = 0;
    for (let j = 0; j < atoms.length; j++) {
      if (i !== j) { // Don't calculate repulsion with itself
        const otherAtom = atoms[j];
        const distanceX = atom.x - otherAtom.x;
        const distanceY = atom.y - otherAtom.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Apply repulsion force inversely proportional to distance
        let bias = 200
        if (distance < radius * 2 + bias) { // Only apply repulsion if within overlap range
            const minimumForce = (radius * 2 + bias) / 5; // Adjust as needed
        //   const force = (radius * 2 - distance) / 5; // Adjust strength as needed
            const force = Math.max(bias, (radius * 2 - distance) / 5);
            repulsionX += force * distanceX / distance;
            repulsionY += force * distanceY / distance;
        }
      }
    }

    // Update atom's position with repulsion
    atom.x += repulsionX;
    atom.y += repulsionY;

    // Keep atom within canvas boundaries
    atom.x = Math.max(radius, Math.min(atom.x, canvas.width - radius));
    atom.y = Math.max(radius, Math.min(atom.y, canvas.height - radius));

    // Draw the atom with its adjusted position
    drawAtom(atom.x, atom.y, atom.text);
  }
}

// Randomly generate atoms and store them in the array
for (let i = 0; i < 9; i++) {
  const x = Math.random() * (canvas.width - radius * 2) + radius;
  const y = Math.random() * (canvas.height - radius * 2) + radius;
  atoms.push({ x, y, text: 'atom-' + i });
}

// Start the animation loop
animateAtoms(); // Initial drawing

