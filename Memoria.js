class Stack{
    constructor(){
        this.stack=[];
    }

    push(element){
        if(this.size <= 8){
            this.stack.push(element);
        }else{
            console.log("Pila llena");
        }
        return this.stack;
    }
    SetT(element,at){
        if(at <= 8){
            this.stack[at] = element;
        }
        return this.stack;
    }
    Copy(src,dest){
        if(src <=8 && dest <= 8){
            this.stack[dest] = this.stack[src];
        }
        return this.stack;
    }
    pop(){
        return this.stack.pop();
    }
    peek(){
        return this.stack[this.stack.length -1 ];
    }
    size(){
        return this.stack.length;
    }
    print(){
        console.log(this.stack);
    }
    take(dest){
        var elemet = this.stack.peek();
        this.stack.pop();
        this.stack[dest]=elemet; 

    }
}
class Memoria{
    constructor(){
        var pila = new Stack();
    }
}