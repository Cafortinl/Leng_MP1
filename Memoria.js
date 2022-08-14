class Memoria{
    constructor(){
        this.stack=[];        
        this.registers = { TF: 0, T0: 0, T1: 0, T2: 0, T3: 0, T4: 0, T5: 0, T6: 0, T7: 0 };
    }
    
    Put(element){
        let validation = new RegExp('T(F|[0-7])');
        if (validation.test(dest)) {
            this.stack.push(this.registers[element]);
        } else {
            this.stack.push(element);
        }
    }

    SetT(dest, src){
        let validation = new RegExp('T(F|[0-7])');
        if (validation.test(dest)) {
            this.registers[dest] = src;
        } else {
            console.log('Invalid destination.');
        }
    }

    Copy(dest_A, dest_B){
        let validation = new RegExp('T(F|[0-7])');
        if (validation.test(dest_A) && validation.test(dest_B)) {
            this.registers[dest_A] = this.registers[dest_B];
        } else {
            console.log('Invalid destination.');
        }
    }

    Take(dest){
        let validation = new RegExp('T(F|[0-7])');
        if(validation.test(dest)){
            this.registers[dest] = this.peek();
            this.stack.pop();
        }
        return this.stack.pop();
    }

    peek(){
        return this.stack[this.stack.length -1 ];
    }

    getRegister(dest) {
        let validation = new RegExp('T(F|[0-7])');
        if(validation.test(dest)){
            return this.registers[dest];
        } else {
            console.log('Invalid register.');
        }
    }
    
    Sum(dest,src){
        if(validation.test(dest)){
          this.SetT(dest,this.getRegister(dest)+src);  
        }
    }
    
    Res(dest,src){
        if(validation.test(dest)){
            this.SetT(dest,this.getRegister(dest)-src);  
          }
    }
    
    mult(dest,src){
        if(validation.test(dest)){
            this.SetT(dest,this.getRegister(dest)*src);  
        }
    }
    
    dic(dest,src){
        if(validation.test(dest)){
            this.SetT(dest,this.getRegister(dest)/src);  
        }
    }
}