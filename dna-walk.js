const fs = require('fs');
const math = require('mathjs');
const Jimp = require('jimp');

const vertices = new Map([
    ['a', [0, 0]],
    ['g', [1, 1]],
    ['t', [1, 0]],
    ['c', [0, 1]]
]);

const width = 1200;
const height = 1200;

let image = new Jimp(width, height, (err, image) => {
    if (err) throw err;
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++){
            image.setPixelColor(0x000000FF, i, j);
        }
    }
    const readable = fs.createReadStream("./yl6854.dna", {
        encoding: 'utf8',
        fd: null,
    });
    let pos = [0.5, 0.5];
    readable.on('readable', () => {
        let letter;
        while (null !== (letter = readable.read(1))) {
            const vertex = vertices.get(letter.toLowerCase());
            if (vertex) {
                pos = math.subtract(pos, math.multiply(0.5, math.subtract(pos, vertex)));
                const x = Math.round(pos[0]*width);
                const y = Math.round(pos[1]*height);
                // console.log(`${x} ${y}`);

                //const hex = Jimp.rgbaToInt(0,255,0, 255);
                image.setPixelColor(0x00FF00FF, x, y);
                //console.log(`${letter} ${JSON.stringify(pos)} ${JSON.stringify(imageData[i][j])}`);
            }
        }
        console.log('end walk');
    });

    readable.on('end',  () => {
        image.write('test.png', (err) => {
            if (err) throw err;
        });
    });
});









/*var readable = fs.createReadStream("./GRCh38_latest_genomic.fna", {
    encoding: 'utf8',
    fd: null,
});*/



