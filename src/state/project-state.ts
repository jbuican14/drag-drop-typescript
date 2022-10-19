import { Project, ProjectStatus } from '../models/project-model';
  // PROJECT STATE MANAGEMENT
  type Listener = (items: Project[]) => void;
  
  export class ProjectState {
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

  export const projectState = ProjectState.getInstance();
