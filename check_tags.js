import fs from 'fs';
const content = fs.readFileSync('d:/00_6_sigma/src/App.jsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
lines.forEach((line, idx) => {
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    const oldBalance = balance;
    balance += opens - closes;
    if (line.includes("case '")) {
        console.log(`Step ${line.trim()}: balance=${balance}`);
    }
});
console.log(`Final balance: ${balance}`);
