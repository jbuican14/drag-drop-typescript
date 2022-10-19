import { DragTarget} from '../models/drag-drop-interfaces';
import { Project, ProjectStatus } from '../models/project-model'; 
import { autobind } from '../decorators/autobind-decorator'; 
import { Component } from './base.component';
import { projectState } from '../state/project-state';
import { ProjectItem } from './project-item.component';

    // PROJECT LIST CLASS
    export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
        const projId = event.dataTransfer!.getData('text/plain');
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