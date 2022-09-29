"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length > validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value > validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value < validatableInput.max;
    }
    return isValid;
}
// AUTOBINE DECORATOR
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjustDescriptor = {
        configurable: true,
        get() {
            const boundFunction = originalMethod.bine(this);
            return boundFunction;
        }
    };
}
class ProjectInput {
    constructor() {
        this.configure();
        this.templateElm = document.getElementById('project-input');
        this.hostElm = document.getElementById('app');
        const importedNode = document.importNode(this.templateElm.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = 'user-input';
        this.titleInputElm = this.element.querySelector('#title');
        this.descInputElm = this.element.querySelector('#description');
        this.peopleNumInputElm = this.element.querySelector('#people-num');
        this.attach();
        this.init();
    }
    init() {
        // this.element.addEventListener('submit', this.submitHandler.bind(this));  or use decorator
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }
    getAllUserInput() {
        const title = this.titleInputElm.value;
        const description = this.descInputElm.value;
        const peopleNum = this.peopleNumInputElm.value;
        // validate the value
        if (title.trim().length === 0 || description.trim().length === 0 || peopleNum.trim().length === 0) {
            alert('Invalid input, please try again');
        }
        else {
            return [title, description, +peopleNum];
        }
    }
    resetInputForm() {
        this.titleInputElm.value = '';
        this.descInputElm.value = '';
        this.peopleNumInputElm.value = '';
    }
    submitHandler(evt) {
        evt.preventDefault();
        const userInput = this.getAllUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, peopleNum] = userInput;
            console.log('🚀 ~ file: app.ts ~ line 67 ~ ProjectInput ~ submitHandler ~ title, description, peopleNum', title, description, peopleNum);
            this.resetInputForm();
        }
    }
    configure() {
        // this.templateElm = document.getElementById('project-input')! as HTMLTemplateElement;
        // this.hostElm = document.getElementById('app')! as HTMLDivElement;
        // const importedNode = document.importNode(this.templateElm.content, true); 
        // this.element = importedNode.firstElementChild as HTMLFormElement;
        // this.element.id = 'user-input'; 
        // this.titleInputElm
    }
    attach() {
        this.hostElm.insertAdjacentElement('afterbegin', this.element);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "init", null);
const projectInputOne = new ProjectInput();
//# sourceMappingURL=app.js.map