// DRAG & DROP INTERFACES
interface Draggable {
  //need 2 handlers
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void; 
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler( event: DragEvent): void; 
}

// PROJECT TYPE
// using class because the need to instanciate this
enum ProjectStatus {
  Active,
  Finished,
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// PROJECT STATE MANAGEMENT
type Listener = (items: Project[]) => void;
class ProjectState {
  private listeners: Listener[] = []; // create a subscription -- array of listeners
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) return this.instance;

    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFunction: Listener) {
    this.listeners.push(listenerFunction);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(newProject);
    this.updateListeners(); 
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(proj => proj.id === projectId);
    if(project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners(); 
    }
  }

  private updateListeners() {
    for (const listenerFunction of this.listeners) {
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

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}

// AUTOBINE DECORATOR
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFunction = originalMethod.bind(this);
      return boundFunction;
    },
  };
  return adjustDescriptor;
}

// COMPONENT BASE CLASS
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElm: HTMLTemplateElement;
  hostElm: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElm = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElm = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(this.templateElm.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElm.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }

  // force any to use these twoo
  abstract configure(): void;
  abstract renderContent(): void;
}

// PROJECTITEM CLASS
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project; 

  get persons() {
    if(this.project.people === 1) {
      return '1 person';
    }else {
      return `${this.project.people} people`;
    }
  }

  constructor(hostId: string, project:Project) {
    super('single-project', hostId, false, project.id);
    this.project = project; 

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id); // just id so we can pull from stage
    event.dataTransfer!.effectAllowed = 'move'; 
    
  }
  // @autobind
  dragEndHandler(_: DragEvent): void {
    console.log('DragEnd')
  }

  configure(): void {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;  
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned.'; 
    this.element.querySelector('p')!.textContent = this.project.description;   
  }
}

// PROJECT LIST CLASS
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listElm = this.element.querySelector('ul')!;
      listElm.classList.add('droppable'); 
    }
  }

  @autobind
  dropHandler(event: DragEvent): void {
    console.log('🚀 ~ file: app.ts ~ line 235 ~ ProjectList ~ dropHandler ~ event');  const projId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(projId, this.type === 'active'? ProjectStatus.Active: ProjectStatus.Finished); 


  }

  @autobind
  dragLeaveHandler(event: DragEvent): void {
    const listElm = this.element.querySelector('ul')!;
    listElm.classList.remove('droppable'); 
  }

  private renderProjects() {
    const listElm = document.getElementById(
      `${this.type}-project-list`
    )! as HTMLUListElement;

    // performance issue but small project is fine.
    listElm.innerHTML = "";
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
    }
  }

  configure(): void {
    this.element.addEventListener('dragover', this.dragOverHandler); 
    this.element.addEventListener('dragleave', this.dragLeaveHandler); 
    this.element.addEventListener('drop', this.dropHandler); 

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        if (this.type === "active") {
          return project.status === ProjectStatus.Active;
        } else {
          return project.status === ProjectStatus.Finished;
        }
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  // private attach() {
  //   this.hostElm.insertAdjacentElement("beforeend", this.element);
  // }
}

// PROJECT INPUT CLASS
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElm: HTMLInputElement;
  descInputElm: HTMLInputElement;
  peopleNumInputElm: HTMLInputElement;

  constructor() {
    super("project-input", "app", false, "user-input");
    this.configure();
    this.renderContent();

    this.titleInputElm = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descInputElm = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleNumInputElm = this.element.querySelector(
      "#people-num"
    ) as HTMLInputElement;
  }

  renderContent(): void {}

  private getAllUserInput(): [string, string, number] | void {
    const title = this.titleInputElm.value;
    const description = this.descInputElm.value;
    const peopleNum = this.peopleNumInputElm.value;

    // construct its interface (reuse the interface above)
    const titleValidatable: Validatable = {
      value: title,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 4,
    };
    const peopleNumValidatable: Validatable = {
      value: +peopleNum,
      required: true,
      min: 1,
      max: 6,
    };

    // validate the value
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleNumValidatable)
    ) {
      alert("Invalid input, please try again");
    } else {
      return [title, description, +peopleNum];
    }
  }

  private resetInputForm() {
    this.titleInputElm.value = "";
    this.descInputElm.value = "";
    this.peopleNumInputElm.value = "";
  }

  @autobind
  private submitHandler(evt: Event) {
    evt.preventDefault();
    const userInput = this.getAllUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, peopleNum] = userInput;
      projectState.addProject(title, description, peopleNum);
      this.resetInputForm();
    }
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
}

const projectInputOne = new ProjectInput();
const activeProjectList_demo = new ProjectList("active");
const finishedProjectList_demo = new ProjectList("finished");
