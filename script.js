function initCalculator(){
    class Calculator{
        constructor(prevOperand, currOperand){
            this.prevOperand = prevOperand;
            this.currOperand = currOperand;
            this.clear();
        }
        clear(){
            this.currOp = "";
            this.prevOp = "";
            this.operation = undefined;
        }
        delete(){
            this.currOp = this.currOp.toString().slice(0,-1);
        }
        appendNumber(number){
            if(number === '.' && this.currOp.includes('.')) return;
            this.currOp = this.currOp.toString().concat(number.toString());
        }
        chooseOperation(operation){
            if(this.currOp === '') return;
            if(this.prevOp !== '') {
                this.compute();
            }
            this.operation = operation;
            this.prevOp = this.currOp;
            this.currOp = '';
        }
        compute(){
            let answer;
            let prev = parseFloat(this.prevOp);
            let curr = parseFloat(this.currOp);
            if(isNaN(prev) || isNaN(curr)) return;
            switch(this.operation){
                case '+':
                    answer = prev + curr;
                    break;
                case '-':
                    answer = prev - curr;
                    break;
                case '*':
                    answer = prev * curr;
                    break;
                case '÷':
                    answer = prev / curr;
                    break;
                default:
                    return;
            }
            this.currOp = answer;
            this.operation = undefined;
            this.prevOp = '';
        }
        getDisplayNumber(num){
            const strnum = num.toString();
            const whole = parseFloat(strnum.split('.')[0]);
            const decimal = strnum.split('.')[1];
            let intDisplay;
            if(isNaN(whole)){
                intDisplay = '';
            } else{
                intDisplay = whole.toLocaleString('en', {maximumFractionDigits:0});
            }
            if(decimal != null){
                return `${intDisplay}.${decimal}`;
            } else{
                return intDisplay;
            }
        }
        updateDisplay(){
            this.currOperand.innerText = this.getDisplayNumber(this.currOp);
            if(this.operation != null){
                this.prevOperand.innerText = `${this.prevOp}${this.operation}`;
            } else{
                this.prevOperand.innerText = '';
            }
        }
    }

    const container = document.querySelector(".calculator-grid");
    const numberButton = container.querySelectorAll("[data-number]");
    const operationButton = container.querySelectorAll("[data-operation]");
    const equalButton = container.querySelector("[data-equals]");
    const deleteButton = container.querySelector("[data-delete]");
    const allclearButton = container.querySelector("[data-all-clear]");
    const prevOperand = container.querySelector("[data-prev]");
    const currOperand = container.querySelector("[data-curr]");

    const calculator = new Calculator(prevOperand, currOperand);
    numberButton.forEach(button => {
        button.addEventListener('click', ()=>{
            calculator.appendNumber(button.innerText);
            calculator.updateDisplay();
        })
    })
    operationButton.forEach(button => {
        button.addEventListener('click', ()=>{
            calculator.chooseOperation(button.innerText);
            calculator.updateDisplay();
        })
    })
    equalButton.addEventListener('click', () => {
        calculator.compute();
        calculator.updateDisplay();
    })
    allclearButton.addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    })
    deleteButton.addEventListener('click', () => {
        calculator.delete();
        calculator.updateDisplay();
    })
    return calculator;
}

function initTimer(){
    class Timer {
        constructor(displayElement) {
            this.displayElement = displayElement;
            this.startTime = 0;
            this.elapsedTime = 0;
            this.intervalId = null;
        }
    
        start() {
            this.startTime = Date.now() - this.elapsedTime;
            this.update();
            this.intervalId = setInterval(() => this.update(), 100);
        }
    
        stop() {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    
        reset() {
            this.stop();
            this.elapsedTime = 0;
            this.updateDisplay(0);
        }
    
        update() {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay(this.elapsedTime);
        }
    
        updateDisplay(elapsedTime) {
            const totalSeconds = Math.floor(elapsedTime / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            this.displayElement.innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    const timerDisplay = document.querySelector(".display");
    const startButton = document.querySelector(".start");
    const stopButton = document.querySelector(".stop");
    const resetButton = document.querySelector(".reset");
    
    const timer = new Timer(timerDisplay);
    startButton.addEventListener("click", ()=>timer.start());
    stopButton.addEventListener("click", ()=>timer.stop());
    resetButton.addEventListener("click", ()=>timer.reset());
    
    class Calculator{
        constructor(previous, current){
            this.previous = previous;
            this.current = current;
            this.clear();
        }
        clear(){
            this.prev = "";
            this.curr = "";
            this.operation = undefined;
            this.hasHour = false;
            this.hasMinute = false;
        }
        appendNum(value){
            if(this.hasMinute === true) return;
            this.curr = this.curr.toString() + value;
        }
        appendOperation(operation){
            if(this.curr === "" || this.curr.endsWith("+")) return;
            if(!this.curr.endsWith("hr") && !this.curr.endsWith("min")) return;
            this.curr += operation.toString();
            this.hasHour = false;
            this.hasMinute = false;
        }
        appendUnit(unit){
            if (this.curr.endsWith('hr') || this.curr.endsWith('min')) return;
            if(unit === 'hr'){
                if(this.hasHour) return;
                this.hasHour = true;
            }
            else if(unit === 'min'){
                if(this.hasMinute) return;
                this.hasMinute = true;
            }
            if (isNaN(this.curr[this.curr.length - 1])) return;
            this.curr += unit;
        }
        delete(){
            if (this.curr.endsWith('hr')) {
                this.curr = this.curr.toString().slice(0, -2);
                this.hasHour = false;
            }
            else if (this.curr.endsWith('min')) {
                this.curr = this.curr.toString().slice(0, -3);
                this.hasMinute = false;
            }
            else{
                this.curr = this.curr.toString().slice(0, -1);
            }
        }
        formatTime(totalMinutes) {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            if (hours === 0) {
                return `${minutes}min`;
            }
            return `${hours}hr${minutes}min`;
        }
        compute(){
            const timeStrings = this.curr.split('+');
            let totalMinutes = 0;
            for (let segment of timeStrings) {
                const parsedTime = this.parseTime(segment);
                totalMinutes += parsedTime.totalMinutes;
            }
            this.prev = this.curr;
            this.curr = this.formatTime(totalMinutes);
            this.operation = undefined;
            this.hasHour = false;
            this.hasMinute = false;
        }
        parseTime(timeString){
            let hours = 0;
            let minutes = 0;
            if(timeString.includes("hr")){
                const hrIndex = timeString.indexOf('hr');
                hours = parseInt(timeString.substring(0, hrIndex)) || 0;
                timeString = timeString.substring(hrIndex + 2);
            }
            if(timeString.includes("min")){
                const minIndex = timeString.indexOf('min');
                minutes = parseInt(timeString.substring(0, minIndex)) || 0;
            }
            return { hours: hours, minutes: minutes, totalMinutes: hours * 60 + minutes };
        }
        updateDisplay(){
            this.current.innerText = this.curr;
            this.previous.innerText = this.prev;
        }
    }
    
    const container = document.querySelector(".timer-mode");
    const numberButton = container.querySelectorAll("[data-number]");
    const operationButton = container.querySelectorAll("[data-operation]");
    const ACButton = container.querySelector("[data-allclear]");
    const deleteButton = container.querySelector("[data-delete]");
    const unitButton = container.querySelectorAll("[data-unit]");
    const previousOperand = container.querySelector("[data-timer-prev]");
    const currentOperand = container.querySelector("[data-timer-curr]");
    const equalsButton = container.querySelector("[data-equals]");
    
    const calc = new Calculator(previousOperand, currentOperand);
    
    deleteButton.addEventListener('click', button => {
        calc.delete();
        calc.updateDisplay();
    })
    operationButton.forEach(button => {
        button.addEventListener('click', () => {
            calc.appendOperation(button.innerText);
            calc.updateDisplay();
        });
    });
    numberButton.forEach(button => {
        button.addEventListener('click', () => {
            calc.appendNum(button.innerText);
            calc.updateDisplay();
        });
    });
    unitButton.forEach(button => {
        button.addEventListener('click', () => {
            calc.appendUnit(button.innerText);
            calc.updateDisplay();
        });
    });
    ACButton.addEventListener('click', () => {
        calc.clear();
        calc.updateDisplay();
    });
    equalsButton.addEventListener('click', () => {
        calc.compute();
        calc.updateDisplay();
    });
    return calc;
}

document.addEventListener("DOMContentLoaded", function() {
    const timer = initTimer();
    const calculator = initCalculator();
    initializePage();

    function initializePage() {
        switchMode('calculator');
        const calculatorButton = document.getElementById("calculator-mode-button");
        const timerButton = document.getElementById("timer-mode-button");

        calculatorButton.addEventListener("click", () => switchMode('calculator'));
        timerButton.addEventListener("click", () => switchMode('timer'));
    }

    function switchMode(mode) {
        const calculatorSection = document.getElementById("calculator-section");
        const timerSection = document.querySelector(".timer-mode");
        if (mode === 'calculator') {
            calculatorSection.style.display = 'grid';
            timerSection.style.display = 'none';
            if(timer){ 
                timer.clear(); 
                timer.updateDisplay();
            }
        } else if (mode === 'timer') {
            timerSection.style.display = 'flex';
            calculatorSection.style.display = 'none';
            if(calculator){
                 calculator.clear();
                 calculator.updateDisplay();
            }
        }
    }
});