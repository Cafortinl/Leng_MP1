class Memory{
    constructor(){
        this.stack=[];        
        this.registers = { TF: 0, T0: 0, T1: 0, T2: 0, T3: 0, T4: 0, T5: 0, T6: 0, T7: 0 };
        this.validation = new RegExp('T(F|[0-7])');
    }
    
    Put(src){
        if (this.validation.test(src)) {
            this.stack.push(this.registers[src]);
            return true;
        } else if (!isNaN(src)){
            this.stack.push(parseInt(src));
            return true;
        }
        return false;
    }

    SetT(dest, src){
        if (this.validation.test(dest)) {
            this.registers[dest] = parseInt(src);
            return true;
        } else {
            console.log('Invalid destination.');
            return false;
        }
    }

    Copy(dest_A, dest_B){
        if (this.validation.test(dest_A) && this.validation.test(dest_B)) {
            this.registers[dest_A] = this.registers[dest_B];
            return true;
        } else {
            console.log('Invalid destination.');
            return false;
        }
    }

    Take(dest){
        if(this.validation.test(dest)){
            if (this.stack.length > 0) {
                this.registers[dest] = this.peek();
                this.stack.pop();
                return true;
            }
        }else{
            return false;
        }
        
    }

    peek(){
        return this.stack[this.stack.length -1 ];
    }

    getRegister(dest, showMsg) {        
        if(this.validation.test(dest)){
            return this.registers[dest];
        } else {
            if (showMsg){
                console.log('Invalid register.');
            }
            return false;
        }
    }
    
    Sum(dest,src){
        if(this.validation.test(dest)){
            this.SetT(dest, this.registers[dest] + this.registers[src]);
            return true;  
        }else{
            return false;
        }
    }
    
    Res(dest,src){
        if(this.validation.test(dest)){
            this.SetT(dest,this.registers[dest] - this.registers[src]);
            return true;  
          }else{
            return false;
          }
    }
    
    Mult(dest,src){
        if(this.validation.test(dest)){
            this.SetT(dest,this.registers[dest] * this.registers[src]);
            return true;  
        }else{
            return false;
        }
    }
    
    Div(dest,src){
        if(this.validation.test(dest)){
            this.SetT(dest,this.registers[dest] / this.registers[src]);
            return true;  
        }else{
            return false;
        }
    }

    Comp(reg1, reg2) {
        let success = true;
        let compVal;

        if (this.validation.test(reg1)) {
            if (this.validation.test(reg2)){
                if (this.registers[reg1] === this.registers[reg2]) {
                    compVal = 0;
                } else if (this.registers[reg1] > this.registers[reg2]) {
                    compVal = 1;
                } else {
                    compVal = -1;
                }
            } else {
                if (this.registers[reg1] === parseInt(reg2)) {
                    compVal = 0;
                } else if (this.registers[reg1] > parseInt(reg2)) {
                    compVal = 1;
                } else {
                    compVal = -1;
                }
            }
        } else {
            console.log('Reg1 is not a valid register.');
            success = false;
        }

        return {'success': success, 'comp': compVal};
    }
}