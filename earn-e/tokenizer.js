const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

function drawBubble(x, y, text) {
    // Draw bubble shape, line, and text
}

console.log('testing tokenizers')

// Randomly generate coordinates and draw initial bubbles
for (let i = 0; i < 10; i++) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    drawBubble(x, y, 'Bubble #' + i);
}

// Add canvas to the HTML container
document.getElementById('bubbles-container').appendChild(canvas);
