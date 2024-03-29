let grid = [];
let instructions = [];
let robot;
let memory;
let tags = [];
let tagIndex = [];
let logs = [];
let instruction_index;
let log_i;
let logTA;
let instTA;
let objective_sprite;

function mapFileSelected(file) {
    grid = []; //Clearing map matrix
    loadedImages = true;

    let metadata = "";
    let contents;
    let i = 0;

    if (file.type !== 'text') {
        AddTetxtConsole('The selected file must be a text file.');
        console.log('The selected file must be a text file.');
    } else {
        let metaRegex = new RegExp('[0-9]+, *[0-9]+');
        let dimensions;
        while (file.data[i] != '\n') {
            metadata += file.data[i];
            i++;
        }

        if (metaRegex.test(metadata)) {

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
            AddTetxtCode('');
        } else {
            AddTetxtConsole('The selected map file is not compatible.');
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
    return rep;
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
    
    if (instruction === "" || instruction[0] === '/'){
    	return { 'success': success, 'index': lineno };
    }

    instruction = instruction.replace(/\t/g, ' ');
    let instData = instruction.split(' ');

    instData = instData.filter((elem) => {
        return elem !== "";
    });

    if (instData.length <= 4) {

        if (instData[0].includes('.')) {
            instData = instData.slice(1);
        }

        switch (instData[0].toLowerCase()) {
            //Memory instructions
            case 'sett':
                if (instData.length < 4) {
                    success = memory.SetT(instData[1], instData[2]);
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for SetT function with " + instData.length + " arguments."); 
                    console.log("No match for SetT function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'copy':
                if (instData.length < 4) {
                    success = memory.Copy(instData[1], instData[2]);
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Copy function with " + instData.length + " arguments.");
                    console.log("No match for Copy function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'put':
                if (instData.length < 3) {
                    success = memory.Put(instData[1]);
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Put function with " + instData.length + " arguments.");
                    console.log("No match for Put function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'take':
                if (instData.length < 3) {
                    success = memory.Take(instData[1]);
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Take function with " + instData.length + " arguments.");
                    console.log("No match for Take function with " + instData.length + " arguments.");
                    success = false;
                }
                break;

            //Arithmetic instructions
            case 'sum':
                if (instData.length < 4) {
                    success = memory.Sum(instData[1], instData[2]);
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Sum function with " + instData.length + " arguments.");
                    console.log("No match for Sum function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'res':
                if (instData.length < 4) {
                    success = memory.Res(instData[1], instData[2]);
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Res function with " + instData.length + " arguments.");
                    console.log("No match for Res function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'mul':
                if (instData.length < 4) {
                    success = memory.Mult(instData[1], instData[2]);
                } else {
                    console.log("Runtime error in line " + lineno+1 + ": " + "No match for Mul function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'div':
                if (instData.length < 4) {
                    success = memory.Div(instData[1], instData[2]);
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Div function with " + instData.length + " arguments.");
                    console.log("No match for Div function with " + instData.length + " arguments.");
                    success = false;
                }
                break;

            //Flow control instructions
            case 'vaya':
                if (instData.length < 3) {
                    lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Vaya function with " + instData.length + " arguments.");
                    console.log("No match for Vaya function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'comp':
                if (instData.length < 4) {
                    let retTuple = memory.Comp(instData[1], instData[2]);
                    success = retTuple['success'];
                    memory.SetT('TF', retTuple['comp']);
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Comp function with " + instData.length + " arguments.");
                    console.log("No match for Comp function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'vig':
                if (instData.length < 3) {
                    if (memory.registers['TF'] === 0) {
                        lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                    }
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Vig function with " + instData.length + " arguments.");
                    console.log("No match for Vig function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'vnig':
                if (instData.length < 3) {
                    if (memory.registers['TF'] !== 0) {
                        lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                    }
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Vnig function with " + instData.length + " arguments.");
                    console.log("No match for Vnig function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'vma':
                if (instData.length < 3) {
                    if (memory.registers['TF'] === 1) {
                        lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                    }
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Vma function with " + instData.length + " arguments.");
                    console.log("No match for Vma function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'vmai':
                if (instData.length < 3) {
                    if (memory.registers['TF'] >= 0) {
                        lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                    }
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Vmai function with " + instData.length + " arguments.");
                    console.log("No match for Vmai function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'vme':
                if (instData.length < 3) {
                    if (memory.registers['TF'] === -1) {
                        lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                    }
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Vme function with " + instData.length + " arguments.");
                    console.log("No match for Vme function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'vmei':
                if (instData.length < 3) {
                    if (memory.registers['TF'] <= 0) {
                        lineno = tagIndex[tags.indexOf(instData[1])] - 1;
                    }
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Vmei function with " + instData.length + " arguments.");
                    console.log("No match for Vmei function with " + instData.length + " arguments.");
                    success = false;
                }
                break;

            //Action instructions
            case 'mov':
                if (instData.length < 3) {
                    if (memory.getRegister(instData[1], false)) {
                        if (checkBoundaries() && sensors('O') !== 1) {
                            //grid[robot.y_coor][robot.x_coor] = '.';
                            robot.move(memory.registers[instData[1]]);
                            drawRobot();
                        } else {
                            AddTetxtConsole('Runtime error: the robot can\'t move to that position.');
                            console.log('Error: the robot can\'t move to that position.');
                            success = false;
                        }
                    } else if (!isNaN(instData[1])) {
                        if (checkBoundaries() && sensors('O') !== 1) {
                            //grid[robot.y_coor][robot.x_coor] = '.';
                            robot.move(Number(instData[1]));
                            drawRobot();
                        } else {
                            AddTetxtConsole('Runtime error: the robot can\'t move to that position.');
                            console.log('Error: the robot can\'t move to that position.');
                            success = false;
                        }
                    } else {
                        AddTetxtConsole('Invalid value.');
                        console.log('Invalid value.');
                        success = false;
                    }
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Mov function with " + instData.length + " arguments.");
                    console.log("No match for Mov function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'gir':
                if (instData.length < 3) {
                    if (memory.getRegister(instData[1], false)) {
                        robot.rotate(memory.registers[instData[1]]);
                    } else if (!isNaN(instData[1])) {
                        robot.rotate(Number(instData[1]));
                    } else {
                        AddTetxtConsole('Invalid value.');
                        console.log('Invalid value.');
                        success = false;
                    }
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Gir instruction with " + instData.length + " arguments.");
                    console.log("No match for Gir instruction with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'car':
                if (instData.length < 2) {
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
                        AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + 'There is no object to load.');
                        console.log('There is no object to load.');
                        success = false;
                    }
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Car function with " + instData.length + " arguments.");
                    console.log("No match for Car function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'dcar':
                if (instData.length < 2) {
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
                        robot.deload();
                    } else {
                        AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + 'Cannot unload robot in this place.');
                        console.log('Cannot unload robot in this place.');
                        success = false;
                    }
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Dcar function with " + instData.length + " arguments.");
                    console.log("No match for Dcar function with " + instData.length + " arguments.");
                    success = false;
                }
                break;

            //Sensor instructions
            case 'obpX':
                if (instData.length < 3) {
                    success = memory.SetT(instData[1], robot.x_coor);
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No mathc for ObPX function with " + instData.length + " arguments.");
                    console.log("No mathc for ObPX function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'obpy':
                if (instData.length < 3) {
                    success = memory.SetT(instData[1], robot.y_coor);
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No mathc for ObPY function with " + instData.length + " arguments.");
                    console.log("No mathc for ObPY function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'obrt':
                if (instData.length < 3) {
                    success = memory.SetT(instData[1], robot.dirs.indexOf(robot.dir) + 1);
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No mathc for ObRT function with " + instData.length + " arguments.");
                    console.log("No mathc for ObRT function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'obob':
                if (instData.length < 3) {
                    if (checkBoundaries()) {
                        success = memory.SetT(instData[1], sensors('O'));
                    } else {
                        AddTetxtConsole("Checking out of bounds.");
                        console.log("Checking out of bounds.");
                        //success = false;
                    }
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for ObOb function with " + instData.length + " arguments.");
                    console.log("No match for ObOb function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'obme':
                if (instData.length < 3) {
                    if (checkBoundaries()) {
                        success = memory.SetT(instData[1], sensors('C'));
                    } else {
                        AddTetxtConsole("Checking out of bounds.");
                        console.log("Checking out of bounds.");
                        //success = false;
                    }
                } else {
                    AddTetxtConsole();
                    console.log("Runtime error in line " + lineno+1 + ": " + "No match for ObMe function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'obds':
                if (instData.length < 3) {
                    if (checkBoundaries()) {
                        success = memory.SetT(instData[1], sensors('M'));
                    } else {
                        AddTetxtConsole("Checking out of bounds.");
                        console.log("Checking out of bounds.");
                        //success = false;
                    }
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for ObMe function with " + instData.length + " arguments.");
                    console.log("No match for ObMe function with " + instData.length + " arguments.");
                    success = false;
                }
                break;
            case 'obcr':
                success = memory.SetT(instData[1], robot.is_loaded ? 1 : 0);
                break;

            //Outputs
            case 'log':
                if (instData.length < 3) {
                    if (memory.getRegister(instData[1], false)) {
                        AddTetxtConsole("Log: " + memory.registers[instData[1]]);
                    } else if (!isNaN(instData[1])) {
                        AddTetxtConsole("Log: " + Number(instData[1]));
                    } else {
                        AddTetxtConsole('Invalid value.');
                        console.log('Invalid value.');
                        success = false;
                    }
                } else {
                    AddTetxtConsole("Runtime error in line " + lineno+1 + ": " + "No match for Log instruction with " + instData.length + " arguments.");
                    console.log("No match for Gir instruction with " + instData.length + " arguments.");
                    success = false;
                }
                break;


            default:
                success = false;
                AddTetxtConsole('Invalid token in line: ' + (lineno + 1));
                console.log('Invalid token in line: ' + (lineno + 1));
                AddTetxtConsole(instData[0] + ' is not an instruction.');
                console.log(instData[0] + ' is not an instruction.');
                break;
        }
    } else {
        success = false;
        AddTetxtConsole('Invalid token in line: ' + (lineno + 1));
        console.log('Invalid token in line: ' + (lineno + 1));
    }

    AddTetxtCode(instruction);

    return { 'success': success, 'index': lineno };
}

function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function checkState() {
    let m_count = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 'M') {
                m_count++;
            }
        }
    }

    if (m_count > 0) {
        AddTetxtConsole("Failed program: the robot wasn't able to put all the cargo boxes in their respective objectives.");
    } else {
        AddTetxtConsole("Success: all the cargo boxes are in their objectives.");
    }

}

async function autorun() {
    for (instruction_index; instruction_index < instructions.length; instruction_index++) {
        if (instructions[instruction_index][0] !== '/') {
            let retTuple = exec(instructions[instruction_index], instruction_index);
            instruction_index = retTuple['index'];
            if (!retTuple['success']) {
                AddTetxtConsole("Stopping execution.");
                console.log("Stopping execution.");
                instruction_index = instructions.length;
            }
        }
        await wait(0);
    }
    checkState();
}

function exec_next() {
    if (instructions[instruction_index][0] !== '/') {
        if (instruction_index < instructions.length) {
            let retTuple = exec(instructions[instruction_index], instruction_index);
            instruction_index = retTuple['index'];
            if (!retTuple['success']) {
                AddTetxtConsole("Stopping execution.");
                console.log("Stopping execution.");
                instruction_index = instructions.length;
            }
            instruction_index++;
        }
    }
}

function AddTetxtConsole(newline_added){
    logTA.value +=newline_added+'\n' ;
    
}
function  AddTetxtCode(linea_codigo) {
    instTA.value = 'Current instruction:\n';
    instTA.value += linea_codigo + '\n';
    instTA.value += 'Robot direction: ' + drawRobot() + '\n';
    instTA.value += 'Loaded: ' + (robot.is_loaded ? "true" : "false");
}

function srcFileSelected(file) {
    if (file.type !== 'text') {
        AddTetxtConsole('The selected file must be a text file.');
        console.log('The selected file must be a text file.');
    } else {
        memory = new Memory();
        tags = [];
        tagIndex = [];
        instruction_index = 0;
        logTA.value = '';
        instTA.value = '';
        instructions = file.data.split('\n');
        
        console.log(instructions);

        for (let i = 0; i < instructions.length; i++) {
            if (instructions[i].includes('.')) {
                let tagName = instructions[i].slice(0, instructions[i].indexOf('.'));
                if (tagName.length < 6) {
                    tags.push(tagName);
                    tagIndex.push(i);
                } else {
                    AddTetxtConsole(tagName + ' is not a valid tag name.');
                    console.log(tagName + ' is not a valid tag name.');
                    return;
                }
            }
        }

    }
}



const gridScreen = (gs) => {
    gs.w = (gs.displayWidth / 2) - 90;

    gs.drawGrid = () => {
        gs.background(0);
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                if (i === robot.y_coor && j === robot.x_coor) {
                    gs.fill('blue');
                } else if (grid[i][j] === 'M') {
                    gs.fill('red');
                } else if (grid[i][j] === 'C') {
                    gs.fill('yellow');
                } else if (grid[i][j] == 'O') {
                    gs.fill('gray');
                } else {
                    gs.fill(255);
                }
                gs.rect(j * gs.w / grid[0].length, i * gs.w / grid.length, gs.w / grid[0].length, gs.w / grid.length);
            }
        }
    };

    gs.preload = () => {
        memory = new Memory();
    };

    gs.setup = () => {
        logTA = document.getElementById('Console_Display');
        instTA = document.getElementById('Code_Display');

        logTA.value = '';
        instTA.value = '';

        gs.createCanvas(gs.windowWidth / 2, gs.windowHeight - 90);

        //Creating the bottom buttons
        let mapButton = gs.createElement('label', 'Load map file');
        let mapSelect = gs.createFileInput(mapFileSelected);
        mapButton.child(mapSelect);
        mapSelect.hide();

        let codeButton = gs.createElement('label', 'Load instruction file');
        let codeSelect = gs.createFileInput(srcFileSelected);
        codeSelect.style('background-color:')
        codeButton.child(codeSelect);
        codeSelect.hide();

        let autoplayButton = gs.createElement('label', 'Autorun');
        autoplayButton.mouseClicked(autorun);
        
        let nextInstructionButton = gs.createElement('label', ' Next ');
        nextInstructionButton.mouseClicked(exec_next);
    };

    gs.draw = () => {
        if (grid.length > 0)
            gs.drawGrid();
    };
};

let gScreen = new p5(gridScreen, 'grid_div');