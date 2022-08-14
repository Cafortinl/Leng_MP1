let grid = [];
let instructions = [];
let robot;
let w;

function mapFileSelected(file) {
    grid = []; //Clearing map matrix

    let metadata = "";
    let contents;
    let i = 0;

    if (file.type !== 'text') {
        console.log('The selected file must be a text file.');
    } else {
        let metaRegex = new RegExp('[0-9]+, *[0-9]+');
        let dimensions;
        while(file.data[i] != '\n') {
            metadata += file.data[i];
            i++;
        }

        if (metaRegex.test(metadata)){

            dimensions = metadata.match(metaRegex);
            dimensions = dimensions[0].split(',');
            contents = file.data.substring(metadata.length + 1, file.data.length);
            let str_i = 0;

            for (i = 0; i < Number(dimensions[0]); i++) {
                grid[i] = [];
                for (let j = 0; j < Number(dimensions[1]); j++) {
                    grid[i][j] = contents[str_i];
                    if (contents[str_i] === '^' || contents[str_i] === '>' || contents[str_i] === 'v' || contents[str_i] === '<') {
                        let dir;
                        switch (contents[str_i]) {
                            case '^':
                                dir = 0;
                                break;
                            case '>':
                                dir = 1;
                                break;
                            case 'v':
                                dir = 2;
                                break;
                            case '<':
                                dir = 3;
                                break;
                        }
                        robot = new Robot(j, i, dir);
                    }
                    str_i++;
                }
                str_i++;
            }
        } else {
            console.log('The selected map file is not compatible.');
        }
    }
}

function drawGrid() {
    background(255);
    for ( let i = 0; i < grid.length;i++) {
        for ( let j = 0; j < grid[0].length;j++) {
            if (grid[i][j] === 'M') {
                fill('red');
            } else if (grid[i][j] === 'C') {
                fill('yellow');
            } else if (grid[i][j] === '^' || grid[i][j] === '>' || grid[i][j] === 'v' || grid[i][j] === '<') {
                fill('blue');
            } else if (grid[i][j] == 'O') {
                fill('gray');
            } else {
                fill(255);
            }
            rect(j * w, i * w, w-1, w-1);
        }
    }
}

function exec(instruction) {

    instruction.replace('\t', ' ');
    let instData = instruction.split(' ');

    console.log(instData);

    /*if (instData[0] === 'Mov') {
        grid[robot.y_coor][robot.x_coor] = '.';
        robot.move(Number(instData[1]));

        grid[robot.y_coor][robot.x_coor] = '^';
    } else if (instData[0] === 'Gir') {
        robot.rotate(Number(instData[1]));
    } else if (instData[0] === 'Car') {
        switch (robot.dir) {
            case 'UP':
                grid[robot.y_coor - 1][robot.x_coor] = '.';
                break;
            case 'RT':
                grid[robot.y_coor][robot.x_coor + 1] = '.';
                break;
            case 'DN':
                grid[robot.y_coor + 1][robot.x_coor] = '.';
                break;
            case 'LT':
                grid[robot.y_coor][robot.x_coor - 1] = '.';
                break;
        }
    } else if (instData[0] === 'Dcar') {
        switch (robot.dir) {
            case 'UP':
                grid[robot.y_coor - 1][robot.x_coor] = 'C';
                break;
            case 'RT':
                grid[robot.y_coor][robot.x_coor + 1] = 'C';
                break;
            case 'DN':
                grid[robot.y_coor + 1][robot.x_coor] = 'C';
                break;
            case 'LT':
                grid[robot.y_coor][robot.x_coor - 1] = 'C';
                break;
        }
    }*/
}

function srcFileSelected(file) {
    if (file.type !== 'text') {
        console.log('The selected file must be a text file.');
    } else {
        instructions = file.data.split('\n');
        for (let i = 0; i < instructions.length;i++) {
            exec(instructions[i]);
        }
    }
}

function setup() {
    //All this is temporal
    createCanvas(1000, 1000);
    w = 40;
    let mapLabel = createElement('label', 'Load map file');
    let mapSelect = createFileInput(mapFileSelected);
    mapLabel.child(mapSelect);
    mapSelect.hide();
    let codeLabel = createElement('label', 'Load instruction file');
    let codeSelect = createFileInput(srcFileSelected);
    codeLabel.child(codeSelect);
    codeSelect.hide();
}

function draw() {
    if (grid.length > 0) 
        drawGrid();
}
