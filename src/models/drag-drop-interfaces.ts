// DRAG & DROP INTERFACES
namespace App {
  export interface Draggable {
    //need 2 handlers
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void; 
  }
  
  export interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler( event: DragEvent): void; 
  }
}