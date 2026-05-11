const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Academic Curator bypassing Windows Shell...');

// 1. Start Server
console.log('-> Starting Express Backend...');
const serverProcess = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit',
    shell: false // CRITICAL: This bypasses the need for cmd.exe
});

// 2. Start Client (using Vite directly from node_modules to avoid npm wrapper)
console.log('-> Starting Vite Frontend...');
const clientProcess = spawn('node', ['node_modules/vite/bin/vite.js'], {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
    shell: false // CRITICAL: This bypasses the need for cmd.exe
});

// Handle termination
process.on('SIGINT', () => {
    console.log('\nShutting down...');
    serverProcess.kill();
    clientProcess.kill();
    process.exit();
});
