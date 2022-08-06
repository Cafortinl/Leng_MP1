let grid = [];
let robot;

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
            console.log(robot);
        } else {
            console.log('The selected map file is not compatible.');
        }
    }
}

function srcFileSelected(file) {
    if (file.type !== 'text') {
        console.log('The selected file must be a text file.');
    } else {
        
    }
}

function setup() {
    noCanvas();
    let label = createElement('label', 'Load map file');
    let mapSelect = createFileInput(mapFileSelected);
    label.child(mapSelect);
    mapSelect.hide();
}
