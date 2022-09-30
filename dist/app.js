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
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max;
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
// PROJECT LIST CLASS
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateElm = document.getElementById('project-list');
        this.hostElm = document.getElementById('app');
        const importedNode = document.importNode(this.templateElm.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        this.attach();
        this.renderContent();
    }
    renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
    }
    attach() {
        this.hostElm.insertAdjacentElement('beforeend', this.element);
    }
}
// PROJECT INPUT CLASS
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
        // construct its interface (reuse the interface above)
        const titleValidatable = {
            value: title,
            required: true
        };
        const descriptionValidatable = {
            value: description,
            required: true,
            minLength: 4
        };
        const peopleNumValidatable = {
            value: +peopleNum,
            required: true,
            min: 1,
            max: 6
        };
        // validate the value
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleNumValidatable)) {
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
const activeProjectList_demo = new ProjectList('active');
const finishedProjectList_demo = new ProjectList('finished');
//# sourceMappingURL=app.js.map