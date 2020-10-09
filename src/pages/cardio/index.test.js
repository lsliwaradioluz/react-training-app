import { React } from "src/imports/react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Cardio from "./index";

configure({ adapter: new Adapter() });

const findByTestAttr = (wrapper, val) => wrapper.find(`[data-test='${val}']`);

const wrapper = shallow(<Cardio />);
it("renders without error", () => {
  const appComponent = findByTestAttr(wrapper, "component-app");
  expect(appComponent.length).toBe(1);
});

it("renders counter display", () => {
  const counterDisplay = findByTestAttr(wrapper, "counter-display");
  expect(counterDisplay.length).toBe(1);
});

it("counter starts at 0", () => {
  const count = findByTestAttr(wrapper, "count").text();
  expect(count).toBe("0");
});

describe("decrement", () => {
  it("counter can not go below 0", () => {
    const button = findByTestAttr(wrapper, "decrement-button");
    button.simulate("click");
    const count = findByTestAttr(wrapper, "count").text();
    expect(count).toBe("0");
  });

  it("shows error message when trying to decrement counter below 0", () => {
    const error = findByTestAttr(wrapper, "error");
    const button = findByTestAttr(wrapper, "decrement-button");
    button.simulate("click");
    expect(error.length).toBe(1);
  });

  it("clicking decrement button decrements count", () => {
    const button = findByTestAttr(wrapper, "decrement-button");
    button.simulate("click");
    const count = findByTestAttr(wrapper, "count").text();
    expect(count).toBe("0");
  });
});

describe("increment", () => {
  it("renders increment button", () => {
    const button = findByTestAttr(wrapper, "increment-button");
    expect(button.length).toBe(1);
  });

  it("clicking increment button increments count", () => {
    const button = findByTestAttr(wrapper, "increment-button");
    button.simulate("click");
    const count = findByTestAttr(wrapper, "count").text();
    expect(count).toBe("1");
  });

  it("hides error message when not trying to decrement counter below 0", () => {
    const error = findByTestAttr(wrapper, "error");
    expect(error.length).toBe(0);
  });
});
