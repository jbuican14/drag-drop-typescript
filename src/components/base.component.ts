// COMPONENT BASE CLASS
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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