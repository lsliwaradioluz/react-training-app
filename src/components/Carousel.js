import { React, Component, styled, colors } from "src/imports/react";

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      currentIndex: this.props.index || 0,
    };
    this.wrapperRef = React.createRef();
    this.numberOfSlides = 0;
    this.stroke = 0;
    this.touchStart = 0;
    this.currentMove = 0;
  }

  componentDidMount() {
    this.setState({ mounted: true });
    this.stroke = this.wrapperRef.current.offsetWidth;
    this.numberOfSlides = this.wrapperRef.current.scrollWidth / this.stroke;
    this.changeSlide(this.state.currentIndex);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.index !== this.props.index) {
      this.changeSlide(this.props.index);
    }
  }

  onTouchStartHandler = (event) => {
    this.wrapperRef.current.style.overflowX = "scroll";
    this.touchStart = event.touches[0].screenX;
  };

  onTouchMoveHandler = (event) => {
    this.currentMove = this.touchStart - event.touches[0].screenX;
  };

  onTouchEndHandler = () => {
    this.wrapperRef.current.style.overflowX = "hidden";
    if (
      this.currentMove > 40 &&
      this.state.currentIndex + 1 < this.numberOfSlides
    ) {
      this.changeSlide(this.state.currentIndex + 1);
    } else if (this.currentMove < -40 && this.state.currentIndex > 0) {
      this.changeSlide(this.state.currentIndex - 1);
    } else {
      this.changeSlide(this.state.currentIndex);
    }

    this.touchStart = 0;
    this.currentMove = 0;
  };

  changeSlide = (index) => {
    this.wrapperRef.current.scrollLeft = this.stroke * index;
    this.setState({ currentIndex: index });
  };

  renderIndicators = () => {
    if (!this.state.mounted) {
      return;
    }

    const indicators = [];

    for (let i = 0; i < this.numberOfSlides; i++) {
      indicators.push(
        <$Indicator
          active={this.state.currentIndex === i}
          key={`indicator-${i}`}
          onClick={this.changeSlide.bind(this, i)}
        />
      );
    }

    return indicators;
  };

  render() {
    return (
      <$Carousel>
        <$Indicators>{this.renderIndicators()}</$Indicators>
        <$Slider
          inactive={this.props.inactive}
          ref={this.wrapperRef}
          onTouchStart={this.props.inactive ? null : this.onTouchStartHandler}
          onTouchMove={this.props.inactive ? null : this.onTouchMoveHandler}
          onTouchEnd={this.props.inactive ? null : this.onTouchEndHandler}
        >
          {this.props.children}
        </$Slider>
      </$Carousel>
    );
  }
}

const $Carousel = styled.div`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 100%;
  position: relative;
`;

const $Slider = styled.div`
  overflow-x: ${(props) => (props.inactive ? "hidden" : "scroll")};
  display: flex;
  scroll-behavior: smooth;
  > * {
    width: 100%;
    flex-shrink: 0;
    flex-grow: 0;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const $Indicators = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const $Indicator = styled.div`
  height: 2px;
  flex-basis: 100%;
  flex-shrink: 1;
  background-color: ${(props) => (props.active ? colors.headers : "gray")};
  transition: all 0.3s smooth;
`;

export default Carousel;
