import { type TItemPlacement, itemPlacement } from '@/lib/types';

import { log } from './log';

export type TDashboardControllerProps = {
  container: HTMLElement | null;
  insertLeftClass: string;
  insertRightClass: string;
  itemContentClass: string;
  itemRootClass: string;
};

export class DashboardController {
  canExecute = true;
  container: HTMLElement | null = null;
  items: HTMLElement[] = [];
  insertLeftClass = '';
  insertRightClass = '';
  itemContentClass = '';
  itemRootClass = '';
  timeout: NodeJS.Timeout | null = null;

  /**
   * Dashboard Controller constructor
   * @param {TDashboardControllerProps} props The controller props
   */
  constructor(props: TDashboardControllerProps) {
    const { container, insertLeftClass, insertRightClass, itemContentClass, itemRootClass } = props;
    this.container = container;
    this.insertLeftClass = insertLeftClass;
    this.insertRightClass = insertRightClass;
    this.itemContentClass = itemContentClass;
    this.itemRootClass = itemRootClass;

    log(`${this.container?.classList[0] ?? ''}: Created`, this);
  }

  /**
   * Dashboard Controller destructor
   */
  destroy = (): void => {
    log(`${this.container?.classList[0] ?? ''}: Destroyed`, this);

    this.canExecute = true;
    this.container = null;
    this.items = [];
    this.itemContentClass = '';
    this.itemRootClass = '';
    this.timeout = null;
  };

  /**
   * Method responsible for adding an item to the controller.
   * @param {HTMLElement} item The dashboard item to be added.
   */
  addItem = (item: HTMLElement) => {
    if (this.items.includes(item)) return;
    this.dragElement(item);
    this.setElementsPosition();
    item.style.order = `${this.items.length}`;
    this.items.push(item);
  };

  /**
   * Function responsible for checking if the mouse cursor is hovering a given element.
   * @param {HTMLElement} element The element to be tested.
   * @param {int} mouseX The mouse coordinate in the X axis.
   * @param {int} mouseY The mouse coordinate in the Y axis.
   * @return {boolean} True if the mouse cursor is hovering the element, false otherwise.
   */
  isMouseHovering = (element: HTMLElement, mouseX: number, mouseY: number): boolean => {
    const elementPoly = element.getBoundingClientRect();
    return mouseX >= elementPoly.left && mouseX <= elementPoly.right && mouseY >= elementPoly.top && mouseY <= elementPoly.bottom;
  };

  /**
   * Method responsible for moving each Dashboard item from its old position to the new one, with animation.
   */
  setElementsPosition = () => {
    if (!this.container) {
      console.error('DashboardController: setElementsPosition: "container" is not defined.');
      return;
    }

    // debounce the function's execution (only execute the function one time every 250 milliseconds)
    this.timeout = setTimeout(() => {
      if (this.canExecute) {
        this.canExecute = false;

        log(`${this.container?.classList[0] ?? ''}: Setting elements position ...`);

        const dashboardItems = this.container!.querySelectorAll(`.${this.itemRootClass}`) || [];

        for (let key = 0; key < dashboardItems.length; key++) {
          const containerPoly = this.container!.getBoundingClientRect();
          const currentItemPoly = dashboardItems[key].getBoundingClientRect();
          const currentItemContent = dashboardItems[key].querySelector(`.${this.itemContentClass}`) as HTMLElement;

          const parent = {
            x: containerPoly.left,
            y: containerPoly.top - this.container!.scrollTop
          };

          const ghost = {
            x: currentItemPoly.left - parent.x,
            y: currentItemPoly.top - parent.y,
            width: currentItemPoly.width,
            height: currentItemPoly.height
          };

          // log("key: ", key, "ghost: ", ghost);

          if (currentItemContent) {
            currentItemContent.style.left = `${ghost.x}px`;
            currentItemContent.style.top = `${ghost.y}px`;
            currentItemContent.style.width = `${ghost.width}px`;
            currentItemContent.style.height = `${ghost.height}px`;
          }
        }
      }
      this.canExecute = true;
      this.timeout && clearTimeout(this.timeout);
    }, 250);
  };

  /**
   * Method responsible for reordering the items inside the dashboard every time one item's position is changed.
   * @param {int} baseItem The base item's order.
   * @param {int} reorderedItem The item to be repositioned order.
   * @param {string} placement The item's position. It can be "before" or "after".
   */
  order = (baseItem: number, reorderedItem: number, placement: TItemPlacement) => {
    if (!this.container) {
      console.error('DashboardController: order: "container" is not defined.');
      return;
    }

    let reorderingEndPlace = -1;

    // there is no reorder to be done, return
    if (baseItem === reorderedItem) {
      return;
    }

    let dashboardItems = this.container.querySelectorAll(`.${this.itemRootClass}`);

    //put elements in array accordingly to its css order value
    const elementsArray = [];
    for (let key = 0; key < dashboardItems.length; key++) {
      const orderValue = Number.parseInt((dashboardItems[key] as HTMLElement).style.order);
      elementsArray[orderValue] = dashboardItems[key];
    }

    // there is one item trying to be inserted before the first item of the list
    // let's shift all list items order one position to the
    // after the operation, we rebuild the elements array
    if (reorderedItem < 0) {
      dashboardItems = this.container.querySelectorAll(`.${this.itemRootClass}`);
      [].forEach.call(dashboardItems, dashboardItem => {
        const orderValue = Number.parseInt((dashboardItem as HTMLElement).style.order) + 1;
        (dashboardItem as HTMLElement).style.order = `${orderValue}`;
      });

      for (let key = 0; key < dashboardItems.length; key++) {
        const orderValue = Number.parseInt((dashboardItems[key] as HTMLElement).style.order);
        elementsArray[orderValue] = dashboardItems[key];
      }
      reorderedItem = 0;
      baseItem++;
    }

    //invert reordering accordingly to the position
    // 8 --> 5 (normal order | Ascending )
    // 5 --> 8 (reversed order | Descending )

    if (reorderedItem < baseItem) {
      //Ascending
      log('Ascending');

      if (placement == itemPlacement.before) {
        log('before');
        reorderingEndPlace = Number(baseItem) - 1;
        if (reorderingEndPlace < 0) reorderingEndPlace = 0;
      } else if (placement == 'after') {
        log('after');
        reorderingEndPlace = Number(baseItem);
      }

      for (let key = 0; key < elementsArray.length; key++) {
        if (key >= reorderedItem && key <= reorderingEndPlace) {
          if (key == reorderedItem) {
            if (elementsArray[key]) (elementsArray[key] as HTMLElement).style.order = `${reorderingEndPlace}`;

            log(`${key} -> ${reorderingEndPlace}`);
          } else {
            if (elementsArray[key]) (elementsArray[key] as HTMLElement).style.order = `${key - 1}`;

            log(`${key} -> ${key - 1}`);
          }
        }
      }
    } else if (reorderedItem > baseItem) {
      //Descending
      log('descending');

      if (placement == itemPlacement.before) {
        log('before');
        reorderingEndPlace = Number(baseItem);
      } else if (placement == itemPlacement.after) {
        log('after');
        reorderingEndPlace = Number(baseItem) + 1;
      }
      if (reorderingEndPlace < 0) reorderingEndPlace = 0;

      for (let key = elementsArray.length - 1; key > -1; key--) {
        if (key <= reorderedItem && key >= reorderingEndPlace) {
          if (key == reorderedItem) {
            if (elementsArray[key]) (elementsArray[key] as HTMLElement).style.order = `${reorderingEndPlace}`;

            log(`${key} -> ${reorderingEndPlace}`);
          } else {
            if (elementsArray[key]) (elementsArray[key] as HTMLElement).style.order = `${key + 1}`;

            log(`${key} -> ${key + 1}`);
          }
        }
      }
    }

    this.setElementsPosition();
  };

  /**
   * Method responsible for giving an HTMLElement the functionality of being dragged and dropped.
   * @param {HTMLElement} elem The element to be dragged.
   */
  dragElement = (elem: HTMLElement) => {
    if (!this.container) {
      console.error('DashboardController: dragElement: "container" is not defined.');
      return;
    }

    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    let cloneElem: HTMLElement | undefined = undefined;
    let baseItem: number | undefined = undefined;
    let reorderedItem: number | undefined = undefined;
    let placement: TItemPlacement | undefined = undefined;

    /**
     * Method responsible for setting up the element dragging when the mouse starts clicking the element.
     * @param {MouseEvent} e Mouse event.
     */
    const onStartDrag = (e: MouseEvent) => {
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      // call a function whenever the cursor moves:
      document.onmousemove = onDragElement;
      // call a function when the cursor stops clicking:
      document.onmouseup = onStopDrag;
    };

    /**
     * Method responsible for dragging the element when mouse is clicking it.
     * @param {MouseEvent} e Mouse event.
     */
    const onDragElement = (e: MouseEvent) => {
      e.preventDefault();

      let mouseX: number | undefined = undefined;
      let mouseY: number | undefined = undefined;

      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = mouseX = e.clientX;
      pos4 = mouseY = e.clientY;
      // set the element's new position:

      // create a "visual" clone of the element to be dragged.
      if (cloneElem === undefined) {
        let childElem = elem.querySelector(`.${this.itemContentClass}`) as HTMLElement;
        if (childElem) {
          cloneElem = childElem.cloneNode() as HTMLElement;
          document.body.appendChild(cloneElem);
          cloneElem.innerText = childElem.innerText;
          cloneElem.classList.remove(this.itemContentClass);
          cloneElem.classList.add('draggable-item-clone', 'draggable');
        } else {
          childElem = elem;
          cloneElem = childElem.cloneNode() as HTMLElement;
          document.body.appendChild(cloneElem);
          cloneElem.innerHTML = childElem.innerHTML;
          cloneElem.classList.add('draggable');
        }
        cloneElem.style.width = window.getComputedStyle(elem, null).width;
        cloneElem.style.height = window.getComputedStyle(elem, null).height;
        cloneElem.style.backgroundColor = window.getComputedStyle(childElem, null).backgroundColor;
        cloneElem.style.top = `${elem.getBoundingClientRect().top}px`;
        //log('elem.getBoundingClientRect().top: ', elem.getBoundingClientRect().top);
        cloneElem.style.left = `${elem.getBoundingClientRect().left}px`;
        //log('elem.getBoundingClientRect().left: ', elem.getBoundingClientRect().left);
        elem.style.opacity = '0.1';
        //log('Dashboard Item Grabbed: ', elem.style.order);
        reorderedItem = Number.parseInt(elem.style.order);
      }

      cloneElem.style.top = `${Number.parseInt(cloneElem.style.top) - pos2}px`;
      //log('cloneElem.style.top: ', cloneElem.style.top);
      cloneElem.style.left = `${Number.parseInt(cloneElem.style.left) - pos1}px`;
      //log('cloneElem.style.left: ', cloneElem.style.left);

      const insideContainer = this.isMouseHovering(this.container!, e.clientX, e.clientY);
      const dashboardItems = this.container!.querySelectorAll(`.${this.itemRootClass}`);

      if (insideContainer) {
        [].forEach.call(dashboardItems, item => {
          const dashboardItem = item as HTMLElement;
          const dashboardItemPoly = dashboardItem.getBoundingClientRect();
          //if element hovering grid item
          //log('dashboardItemPoly: ', dashboardItemPoly);
          const itemCenter = dashboardItemPoly.width / 2;
          dashboardItem.classList.remove(this.insertLeftClass);
          dashboardItem.classList.remove(this.insertRightClass);
          if (
            mouseX >= dashboardItemPoly.left &&
            mouseX <= dashboardItemPoly.right - itemCenter &&
            mouseY >= dashboardItemPoly.top &&
            mouseY <= dashboardItemPoly.bottom
          ) {
            //log('Hovering Dashboard Item ' + dashboardItem.style.order + ' before');
            dashboardItem.classList.add(this.insertLeftClass);
            baseItem = Number.parseInt(dashboardItem.style.order);
            placement = 'before';
          } else if (
            mouseX >= dashboardItemPoly.left + itemCenter &&
            mouseX <= dashboardItemPoly.right &&
            mouseY >= dashboardItemPoly.top &&
            mouseY <= dashboardItemPoly.bottom
          ) {
            //log('Hovering Dashboard Item ' + dashboardItem.style.order + ' after');
            dashboardItem.classList.add(this.insertRightClass);
            baseItem = Number.parseInt(dashboardItem.style.order);
            placement = 'after';
          }
        });
      } else {
        // cleanup stale position markers
        [].forEach.call(dashboardItems, item => {
          const dashboardItem = item as HTMLElement;
          dashboardItem.classList.remove(this.insertLeftClass);
          dashboardItem.classList.remove(this.insertRightClass);
        });
      }
    };

    /**
     * Function responsible to stop dragging an element when the mouse button is released.
     */
    const onStopDrag = () => {
      // stop moving when mouse button is released
      document.onmouseup = null;
      document.onmousemove = null;

      if (cloneElem !== undefined) {
        elem.style.opacity = '';
        elem.classList.remove(this.insertLeftClass);
        elem.classList.remove(this.insertRightClass);

        // ensure mouse is hover container
        if (this.isMouseHovering(this.container!, pos3, pos4)) {
          if (!isNaN(Number.parseInt(`${reorderedItem}`)) && !isNaN(Number.parseInt(`${baseItem}`)) && placement !== undefined) {
            // regular reordering operation
            // reorder items that are inside the container, without adding or removing items
            if (baseItem === reorderedItem) {
              if (placement.toLowerCase() === 'before') elem.parentNode?.insertBefore(elem, elem.previousSibling);
              if (placement.toLowerCase() === 'after' && elem.nextSibling) elem.parentNode?.insertBefore(elem.nextSibling, elem);
              this.setElementsPosition();
            } else {
              this.order(baseItem!, reorderedItem!, placement);
              reorderedItem = baseItem = placement = undefined;
            }
          } else {
            insertDashboardItem();
          }
        }
        cloneElem.remove();
        cloneElem = undefined;

        // check if the dragged item should be removed
        removeDashboardItem();
      }

      // cleanup stale position markers
      const dashboardItems = this.container!.querySelectorAll(`.${this.itemRootClass}`);
      [].forEach.call(dashboardItems, item => {
        const dashboardItem = item as HTMLElement;
        dashboardItem.classList.remove(this.insertLeftClass);
        dashboardItem.classList.remove(this.insertRightClass);
      });

      this.setElementsPosition();
    };

    /**
     * Function responsible for inserting a new item to the container
     */
    const insertDashboardItem = () => {
      const dashboardItems = this.container!.querySelectorAll(`.${this.itemRootClass}`);

      let highestOrder = 0;
      // Get highest order number of the grid to prevent duplicated order numbers
      for (let i = 0; i < dashboardItems.length; i++) {
        const orderNr = Number.parseInt((dashboardItems[i] as HTMLElement).style.order);
        highestOrder = orderNr > highestOrder ? orderNr : highestOrder;
      }
      highestOrder++; //increment to new order number

      // create the new item for insertion
      const newElemGhost = document.createElement('div');
      newElemGhost.className = this.itemRootClass;
      elem?.classList.forEach(className => newElemGhost.classList.add(className));
      const newElemContent = document.createElement('div');
      newElemContent.className = this.itemContentClass;
      newElemGhost.appendChild(newElemContent);
      newElemGhost.style.order = `${highestOrder}`;
      newElemContent.innerHTML = cloneElem?.innerHTML || '';
      this.dragElement(newElemGhost);

      //always append a new element after last DOM position
      this.container!.firstElementChild?.appendChild(newElemGhost);
      if (baseItem && placement) this.order(baseItem, highestOrder, placement);
      reorderedItem = baseItem = placement = undefined;
    };

    /**
     * Function responsible for removing an item from the container.
     */
    const removeDashboardItem = () => {
      const insideContainer = this.isMouseHovering(this.container!, pos3, pos4);
      // removal of a container item by dropping it outside the container
      if (elem !== undefined && !isNaN(Number.parseInt(elem.style.order)) && !insideContainer) {
        //save element order
        const removedElemOrder = Number.parseInt(elem.style.order);
        elem.addEventListener('DOMNodeRemoved', () => {
          //create elements array
          const dashboardItems = this.container!.querySelectorAll(`.${this.itemRootClass}`);
          //loop trough elements array and redefine style.order on the elements ordered after the removed one
          [].forEach.call(dashboardItems, item => {
            const dashboardItem = item as HTMLElement;
            let orderValue = Number.parseInt(dashboardItem.style.order);
            if (orderValue >= removedElemOrder) orderValue -= 1;
            dashboardItem.style.order = `${orderValue}`;
          });
          this.setElementsPosition();
        });
        elem.remove();
      }
    };

    elem.onmousedown = onStartDrag;
  };
}
