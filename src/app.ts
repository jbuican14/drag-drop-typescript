// PROJECT TYPE
// using class because the need to instanciate this 
enum ProjectStatus { Active, Finished}
class Project {
  constructor(public id: string, public title: string, public description: string, public people:number, public status: ProjectStatus ) {

  }
}

// PROJECT STATE MANAGEMENT
class ProjectState {
  private listeners: any[] = []; // create a subscription -- array of listeners
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance(){
    if(this.instance) 
      return this.instance;
    
    this.instance = new ProjectState();
    return this.instance; 
  }

  addListener(listenerFunction: Function) {
    this.listeners.push(listenerFunction);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active)
    
    this.projects.push(newProject); 

    for(const listenerFunction of this.listeners) {
      listenerFunction(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance(); 

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
  assignedProjects: Project[];

  constructor(private type:'active' | 'finished') {
    this.templateElm = document.getElementById('project-list')! as HTMLTemplateElement;
    this.hostElm = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElm.content, true); 
    this.element = importedNode.firstElementChild as HTMLElement; 
    this.element.id = `${this.type}-projects`;
    this.assignedProjects = []; 

    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects(); 
    });

    this.attach(); 
    this.renderContent(); 
  }

  private renderProjects() {
    const listElm = document.getElementById(`${this.type}-project-list`);
    
    for(const projectItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = projectItem.title;
      listElm?.appendChild(listItem);
    }
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
      projectState.addProject(title, description, peopleNum);
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