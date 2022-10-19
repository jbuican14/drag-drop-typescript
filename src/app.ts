/// <reference path="models/drag-drop-interfaces.ts" />
/// <reference path="models/project-model.ts" />
/// <reference path="state/project-state.ts" />
/// <reference path="util/validation.ts" />
/// <reference path="decorators/autobind-decorator.ts" />
/// <reference path="components/base.component.ts" />
/// <reference path="components/project-item.component.ts" />
/// <reference path="components/project-list.component.ts" />
/// <reference path="components/project-input.component.ts" />

namespace App {

  const projectInputOne = new ProjectInput();
  const activeProjectList_demo = new ProjectList("active");
  const finishedProjectList_demo = new ProjectList("finished");
}