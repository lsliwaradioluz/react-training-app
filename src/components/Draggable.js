import { React, Component, styled, cloneDeep } from "src/imports/react";

class Draggable extends Component {
  constructor(props) {
    super(props);
    this.draggableRef = React.createRef();
    this.touchStart = null
    this.moveLength = {}
    this.movingElement = null
    this.movingElementIndex = null
    this.nextSibling = null
    this.previousSibling = null
    this.mousedown = false
    this.moveCount = 0
    this.movingElementSiblings = null
  }

  animateElement(element) {
    element.style.transition = `transform .3s`;
    setTimeout(() => {
      element.style.transition = ``;
    }, 300);
  }

  resetState() {
    for (let sibling of this.movingElementSiblings) {
      sibling.style.transform = "";
    }
    this.movingElement.classList.remove("moving");
    this.movingmovingElementIndex = null
    this.movingElement = null
    this.nextSibling = null
    this.previousSibling = null
    this.moveLength = {}
    this.moveCount = 0
    this.movingElementSiblings = null
    document.querySelector("html").style.overflow = "auto";
    this.draggableRef.current.removeEventListener("touchmove", this.onMove, { passive: true })
    this.draggableRef.current.removeEventListener("touchend", this.onEnd, { passive: true })
  }

  moveElement() {
    const valueCopy = cloneDeep(this.props.value);
    const element = valueCopy[this.movingElementIndex];
    const newElementIndex =
      this.movingElementIndex + this.moveCount;
    valueCopy.splice(this.movingElementIndex, 1);
    valueCopy.splice(newElementIndex, 0, element);
    this.props.onInput(valueCopy);
    this.resetState();
  }

  deleteElement() {
    const valueCopy = cloneDeep(this.props.value);
    valueCopy.splice(this.movingElementIndex, 1);
    this.animateElement(this.movingElement);
    this.movingElement.style.transform = `translateX(-500px)`;
    setTimeout(() => {
      this.props.onInput(valueCopy);
      this.resetState();
    }, 300);
  }

  setSiblings() {
    if (this.moveCount > 0) {
      this.nextSibling = this.movingElementSiblings[
        this.movingElementIndex + 1 + this.moveCount
      ];
      this.previousSibling = this.movingElementSiblings[
        this.movingElementIndex + this.moveCount
      ];
    } else if (this.moveCount == 0) {
      this.nextSibling = this.movingElementSiblings[
        this.movingElementIndex + 1
      ];
      this.previousSibling = this.movingElementSiblings[
        this.movingElementIndex - 1
      ];
    } else if (this.moveCount < 0) {
      this.nextSibling =
        this.movingElementSiblings[this.movingElementIndex + this.moveCount];
      this.previousSibling =
        this.movingElementSiblings[
          this.movingElementIndex - 1 + this.moveCount
        ];
    }
  }

  onStart = (event) => {
    if (
      this.props.button &&
      !event.target.classList.contains(this.props.button)
    ) {
      return;
    }
    event.stopPropagation()
    this.draggableRef.current.addEventListener("touchmove", this.onMove, { passive: true })
    this.draggableRef.current.addEventListener("touchend", this.onEnd, { passive: true })

    if (event.target === this.draggableRef.current) {
      return;
    } else {
      this.movingElement = event.target.closest(".draggable > *");
      this.movingElement.classList.add("moving");
    }

    document.querySelector("html").style.overflow = "hidden";
    if (event.type == "touchstart") {
      this.touchStart = {
        vertical: event.touches[0].screenY,
        horizontal: event.touches[0].screenX,
      };
    } else {
      this.touchStart = { vertical: event.screenY, horizontal: event.screenX };
      this.mousedown = true;
    }

    this.movingElementSiblings = this.draggableRef.current.children;
    for (let i = 0; i < this.movingElementSiblings.length; i++) {
      if (this.movingElement === this.movingElementSiblings[i]) {
        this.movingElementIndex = i;
      }
    }

    this.nextSibling = this.movingElementSiblings[this.movingElementIndex + 1];
    this.previousSibling = this.movingElementSiblings[this.movingElementIndex - 1];

    if (this.props.onDragging) {
      this.props.onDragging();
    }
  };

  onMove = (event) => {
    const movingElementTop = this.movingElement.getBoundingClientRect()
      .top;
    const movingElementBottom =
      movingElementTop +
      this.movingElement.getBoundingClientRect().height;
    let nextSiblingBottom, previousSiblingTop;

    if (this.nextSibling) {
      nextSiblingBottom =
        this.nextSibling.getBoundingClientRect().top +
        this.nextSibling.getBoundingClientRect().height;
    }
    if (this.previousSibling) {
      previousSiblingTop = this.previousSibling.getBoundingClientRect()
        .top;
    }
    
    if (event.type === "touchmove") {
      this.moveLength = {
        vertical: event.touches[0].screenY - this.touchStart.vertical,
        horizontal: event.touches[0].screenX - this.touchStart.horizontal,
      };
    } else if (event.type === "mousemove" && this.mousedown === true) {
      this.moveLength = {
        vertical: event.screenY - this.touchStart.vertical,
        horizontal: event.screenX - this.touchStart.horizontal,
      };
    }
    
    this.movingElement.style.transform = `translate(${
      this.moveLength.horizontal < 0
        ? this.moveLength.horizontal
        : 0
    }px, ${this.moveLength.vertical}px)`;

    if (this.nextSibling && movingElementBottom >= nextSiblingBottom) {
      this.animateElement(this.nextSibling);
      const nextSiblingTransform = this.nextSibling.style.transform;
      if (nextSiblingTransform) {
        this.nextSibling.style.transform = "";
      } else {
        this.nextSibling.style.transform = `translateY(${
          nextSiblingTransform - this.movingElement.offsetHeight
        }px)`;
      }

      this.moveCount += 1
      this.setSiblings()
    }

    if (this.previousSibling && movingElementTop <= previousSiblingTop) {
      this.animateElement(this.previousSibling);
      const previousSiblingTransform = this.previousSibling.style
        .transform;
      if (previousSiblingTransform) {
        this.previousSibling.style.transform = "";
      } else {
        this.previousSibling.style.transform = `translateY(${
          previousSiblingTransform + this.movingElement.offsetHeight
        }px)`;
      }
      
      this.moveCount -= 1
      this.setSiblings()
    }

  };

  onEnd = (event) => {
    if (this.moveLength.horizontal < -100) {
      this.deleteElement();
    } else if (this.moveCount != 0) {
      this.moveElement();
    } else {
      if (this.props.onDragFail) {
        this.props.onDragFail();
      }
      this.animateElement(this.movingElement);
      this.resetState();
    }
  };

  render() {
    return (
      <$Draggable
        className="draggable"
        ref={this.draggableRef}
        onTouchStart={this.onStart}
      >
        {this.props.children}
      </$Draggable>
    );
  }
}

const $Draggable = styled.div`
  display: flex;
  flex-direction: column;
`;

export default Draggable;
