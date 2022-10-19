/// <reference path="base.component.ts" />

namespace App {
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
}