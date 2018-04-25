import fs from 'fs';
fs.readFile('./foo.txt', (err, body) => {
    if (err) {
        console.error(err);
    } else {
        console.log(body);
    }
});