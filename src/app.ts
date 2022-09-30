// VALIDATION
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable): boolean {
  let isValid = true;

  if(validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !==0
  }

  if(validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  if(validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength; 
  }

  if(validatableInput.min != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value >= validatableInput.min; 
  }

  if(validatableInput.max != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value <= validatableInput.max; 
  }

  return isValid; 
}

// AUTOBINE DECORATOR
function autobind(
  _:any,
  _2: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjustDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFunction = originalMethod.bine(this);
      return boundFunction; 
    }
  }
} 

// PROJECT LIST CLASS
class ProjectList {
  templateElm: HTMLTemplateElement;
  hostElm: HTMLDivElement; 
  element: HTMLElement;

  constructor(private type:'active' | 'finished') {
    this.templateElm = document.getElementById('project-list')! as HTMLTemplateElement;
    this.hostElm = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElm.content, true); 
    this.element = importedNode.firstElementChild as HTMLElement; 
    this.element.id = `${this.type}-projects`;
    this.attach(); 
    this.renderContent(); 
  }

  private renderContent(){
    const listId = `${this.type}-project-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'; 
  }

  private attach() {
    this.hostElm.insertAdjacentElement('beforeend', this.element); 
  }
}

// PROJECT INPUT CLASS
class ProjectInput {
  templateElm: HTMLTemplateElement;
  hostElm: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElm: HTMLInputElement;
  descInputElm: HTMLInputElement;
  peopleNumInputElm: HTMLInputElement;

  constructor() { 
    this.configure();
    this.templateElm = document.getElementById('project-input')! as HTMLTemplateElement;
    this.hostElm = document.getElementById('app')! as HTMLDivElement;
    
    const importedNode = document.importNode(this.templateElm.content, true); 
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input'; 

    this.titleInputElm = this.element.querySelector('#title') as HTMLInputElement;
    this.descInputElm = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleNumInputElm = this.element.querySelector('#people-num') as HTMLInputElement;
    
    this.attach(); 
    this.init();
  }

  @autobind
  private init() {
    // this.element.addEventListener('submit', this.submitHandler.bind(this));  or use decorator
    this.element.addEventListener('submit', this.submitHandler.bind(this)); 
  }

  private getAllUserInput(): [string, string, number] | void {
    const title = this.titleInputElm.value;
    const description = this.descInputElm.value;
    const peopleNum = this.peopleNumInputElm.value; 

    // construct its interface (reuse the interface above)
    const titleValidatable: Validatable = {
      value: title,
      required: true
    };
    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 4
    };
    const peopleNumValidatable: Validatable = {
      value: +peopleNum,
      required: true,
      min:1,
      max:6
    };

    // validate the value
    if(
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleNumValidatable)
    ) {
      alert('Invalid input, please try again');
    } else {
      return [title, description, +peopleNum]; 
    }
  }

  private resetInputForm() {
    this.titleInputElm.value = '';
    this.descInputElm.value = '';
    this.peopleNumInputElm.value = ''; 
  }
  
  private submitHandler(evt: Event) {
    evt.preventDefault(); 
    const userInput = this.getAllUserInput();

    if(Array.isArray(userInput)) {
      const [title, description, peopleNum] = userInput;
      this.resetInputForm();
    }
  }

  private configure() {
    // this.templateElm = document.getElementById('project-input')! as HTMLTemplateElement;
    // this.hostElm = document.getElementById('app')! as HTMLDivElement;
    
    // const importedNode = document.importNode(this.templateElm.content, true); 
    // this.element = importedNode.firstElementChild as HTMLFormElement;
    // this.element.id = 'user-input'; 

    // this.titleInputElm
  }

  private attach() {
    this.hostElm.insertAdjacentElement('afterbegin', this.element); 
  }
}

const projectInputOne = new ProjectInput(); 
const activeProjectList_demo = new ProjectList('active');
const finishedProjectList_demo = new ProjectList('finished');