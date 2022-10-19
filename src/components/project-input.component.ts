import { autobind as Autobind } from '../decorators/autobind-decorator.js';
import { Component } from './base.component.js';
import * as Validation from '../util/validation.js';
import { projectState } from '../state/project-state.js'

// PROJECT INPUT CLASS
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
    const titleValidatable: Validation.Validatable = {
      value: title,
      required: true,
    };
    const descriptionValidatable: Validation.Validatable = {
      value: description,
      required: true,
      minLength: 4,
    };
    const peopleNumValidatable: Validation.Validatable = {
      value: +peopleNum,
      required: true,
      min: 1,
      max: 6,
    };

    // validate the value
    if (
      !Validation.validate(titleValidatable) ||
      !Validation.validate(descriptionValidatable) ||
      !Validation.validate(peopleNumValidatable)
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

  @Autobind
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
