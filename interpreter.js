let grid = [];
let instructions = [];
let robot;
let memory;
let w;
let tags = [];
let tagIndex = [];

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

function drawRobot() {
    let rep;
    switch (robot.dir) {
        case 'UP':
            rep = '^';
            break;
        case 'RT':
            rep = '>';
            break;
        case 'DN':
            rep = 'v';
            break;
        case 'LT':
            rep = '<';
            break;
    }
    grid[robot.y_coor][robot.x_coor] = rep;
}

function checkBoundaries() {
    let obX, obY;
    switch (robot.dir) {
        case 'UP':
            obX = robot.x_coor;
            obY = robot.y_coor - 1;
            break;
        case 'RT':
            obX = robot.x_coor + 1;
            obY = robot.y_coor;
            break;
        case 'DN':
            obX = robot.x_coor;
            obY = robot.y_coor + 1;
            break;
        case 'LT':
            obX = robot.x_coor - 1;
            obY = robot.y_coor;
            break;
    }

    if (obY < 0 || obY >= grid.length || obX < 0 || obX >= grid[0].length) {
        return false;
    }
    return true;
}

function sensors(objective) {
    let obX, obY;
    switch (robot.dir) {
        case 'UP':
            obX = robot.x_coor;
            obY = robot.y_coor - 1;
            break;
        case 'RT':
            obX = robot.x_coor + 1;
            obY = robot.y_coor;
            break;
        case 'DN':
            obX = robot.x_coor;
            obY = robot.y_coor + 1;
            break;
        case 'LT':
            obX = robot.x_coor - 1;
            obY = robot.y_coor;
            break;
    }

    return grid[obY][obX] === objective ? 1 : 0;
}

function exec(instruction, lineno) {
    let success = true;

    instruction = instruction.replace(/\t/g, ' ');
    let instData = instruction.split(' ');

    instData = instData.filter((elem) => {
        return elem !== "";
    });

    if (instData.length <= 4) {

        if (instData[0].includes('.')) {
            instData = instData.slice(1);
        }

        switch (instData[0]) {
            //Memory instructions
            case 'SetT':
                success = memory.SetT(instData[1],instData[2]);
                break;
            case 'Copy':
                success = memory.Copy(instData[1],instData[2]);
                break;
            case 'Put':
                success = memory.Put(instData[1]);
                break;
            case 'Take':
                success = memory.Take(instData[1]);
                break;

            //Arithmetic instructions
            case 'Sum':
                success = memory.Sum(instData[1],instData[2]);
                break;
            case 'Res':
                success = memory.Res(instData[1],instData[2]);
                break;
            case 'Mul':
                success = memory.Mult(instData[1],instData[2]);
                break;
            case 'Div':
                success = memory.Div(instData[1],instData[2]);
                break;

            //Flow control instructions
            case 'Vaya':
                console.log(lineno);
                lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                console.log(lineno);
                break;
            case 'Comp':
                let retTuple = memory.Comp(instData[1], instData[2]);
                success = retTuple['success'];
                memory.SetT('TF', retTuple['comp']);
                break;
            case 'Vig':
                if (memory.registers['TF'] === 0) {
                    lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                } else {
                    success = false;
                }
                break;
            case 'Vnig':
                if (memory.registers['TF'] !== 0) {
                    lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                } else {
                    success = false;
                }
                break;
            case 'Vma':
                if (memory.registers['TF'] === 1) {
                    lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                } else {
                    success = false;
                }
                break;
            case 'Vmai':
                if (memory.registers['TF'] >= 0) {
                    lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                } else {
                    success = false;
                }
                break;
            case 'Vme':
                if (memory.registers['TF'] === -1) {
                    lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                } else {
                    success = false;
                }
                break;
            case 'Vmei':
                if (memory.registers['TF'] <= 0) {
                    lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                } else {
                    success = false;
                }
                break;
            
            //Action instructions
            case 'Mov':
                if (memory.getRegister(instData[1], false)) {
                    if (checkBoundaries() && sensors('O') !== 1) {
                        grid[robot.y_coor][robot.x_coor] = '.';
                        robot.move(memory.registers[instData[1]]);
                        drawRobot();
                    } else {
                        console.log('Error: the robot can\'t move to that position.');
                        success = false;
                    }
                } else if (!isNaN(instData[1])) {
                    if (checkBoundaries() && sensors('O') !== 1) {
                        grid[robot.y_coor][robot.x_coor] = '.';
                        robot.move(Number(instData[1]));
                        drawRobot();
                    } else {
                        console.log('Error: the robot can\'t move to that position.');
                        success = false;
                    }
                } else {
                    console.log('Invalid value.');
                    success = false;
                }
                break;
            case 'Gir':
                if (memory.getRegister(instData[1], false)) {
                    robot.rotate(memory.registers[instData[1]]);
                } else if (!isNaN(instData[1])) {
                    robot.rotate(Number(instData[1]));
                } else {
                    console.log('Invalid value.');
                    success = false;
                }
                break;
            case 'Car':
                if (checkBoundaries() && sensors('C')) {
                    robot.is_loaded = true;
                    
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
                } else {
                    console.log('There is no object to load.');
                    success = false;
                }
                break;
            case 'Dcar':
                if (checkBoundaries() && sensors('M')) {
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
                } else {
                    console.log('Cannot unload robot in this place.');
                    success = false;
                }
                break;

            //Sensor instructions
            case 'ObPX':
                success = memory.SetT(instData[1], robot.x_coor);
                break;
            case 'ObPY':
                success = memory.SetT(instData[1], robot.y_coor);
                break;
            case 'ObRT':
                success = memory.SetT(instData[1], robot.dirs.indexOf(robot.dir) + 1);
                break;
            case 'ObOb':
                if (checkBoundaries()) {
                    success = memory.SetT(instData[1], sensors('O'));
                } else {
                    console.log("Alert: checking out of bounds. Register not affected.");
                }
                break;
            case 'ObMe':
                if (checkBoundaries()) {
                    success = memory.SetT(instData[1], sensors('C'));
                } else {
                    console.log("Alert: checking out of bounds. Register not affected.");
                }
                break;
            case 'ObDs':
                if (checkBoundaries()) {
                    success = memory.SetT(instData[1], sensors('M'));
                } else {
                    console.log("Alert: checking out of bounds. Register not affected.");
                }
                break;
            case 'ObCr':
                success = memory.SetT(instData[1], robot.is_loaded ? 1 : 0);
                break;

            //Outputs
            case 'Log':
                break;

            
            default:
                success = false;
                console.log('Invalid token in line: ' + (lineno + 1));
                console.log(instData[0] + ' is not an instruction.');
                break;
        }
    } else {
        success = false;
        console.log('Invalid token in line: ' + (lineno + 1));
    }

    return {'success': success, 'index': lineno};
}

function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

async function srcFileSelected(file) {
    if (file.type !== 'text') {
        console.log('The selected file must be a text file.');
    } else {
        memory = new Memoria();
        tags = [];
        tagIndex = [];
        instructions = file.data.split('\n');
        instructions = instructions.filter((elem) => {
            return elem !== "";
        });

        for (let i = 0; i < instructions.length;i++) {
            if (instructions[i].includes('.')) {
                let tagName = instructions[i].slice(0, instructions[i].indexOf('.'));
                if (tagName.length < 6) {
                    tags.push(tagName);
                    tagIndex.push(i);
                } else {
                    console.log(tageName + ' is not a valid tag name.');
                    break;
                }               
            }
        }

        for (let i = 0; i < instructions.length;i++) {
            if (instructions[i][0] !== '/') {
                let retTuple = exec(instructions[i], i);
                i = retTuple['index'];
                if (!retTuple['success']) {
                    console.log("Stopping execution.");
                    i = instructions.length;
                }
            }
            await wait(500);
        }
    }
}

function preload() {
    memory = new Memoria();
}

function setup() {
    //All this is temporal
    createCanvas(500, 500);
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