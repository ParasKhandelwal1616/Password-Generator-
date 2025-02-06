const fs = require('fs');
const path = require('path');

const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');

fs.chmodSync(vitePath, '755'); // Set executable permissions
console.log('Permissions set for vite binary');