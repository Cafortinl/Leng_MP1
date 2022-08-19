class Robot {

    constructor(x_coor, y_coor, dir){
        this.dirs = ['UP', 'RT', 'DN', 'LT'];
        this.x_coor = x_coor;
        this.y_coor = y_coor;
        this.dir = this.dirs[dir];
        this.is_loaded = false;
    }

    //Moves the robot 1 space
    move(val) {
    	val = val > 0 ? 1 : -1;
    
        switch (this.dir) {
            case 'UP':
                this.y_coor -= val;
                break;
            case 'RT':
                this.x_coor += val;
                break;
            case 'DN':
                this.y_coor += val;
                break;
            case 'LT':
                this.x_coor -= val;
                break;
        }
    }

    //Rotates the robot 90 degrees
    rotate(angle) {
        angle = angle > 0 ? 1 : -1;

        //this.dirs.indexOf(this.dir) + angle gives the new index relative to the original position
        //the + this.dirs.length corrects for negative values
        //the % this.dirs.length makes it so the array works as a circular array
        this.dir = this.dirs[(((this.dirs.indexOf(this.dir) + angle)) + this.dirs.length) % this.dirs.length];
    }

    load() {
        this.is_loaded = true;
    }

    deload() {
        this.is_loaded = false;
    }
}
