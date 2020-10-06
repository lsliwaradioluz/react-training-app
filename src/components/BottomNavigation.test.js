import { React } from "src/imports/react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { BottomNavigation, $BottomLink } from "src/components/BottomNavigation";

configure({ adapter: new Adapter() });

describe("<BottomNavigation />", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<BottomNavigation />);
  });
  it("should render 5 links when not admin", () => {
    wrapper.setProps({ user: { admin: false } });
    expect(wrapper.find($BottomLink)).toHaveLength(5);
  });

  it("should render 6 links when admin", () => {
    wrapper.setProps({ user: { admin: true } });
    expect(wrapper.find($BottomLink)).toHaveLength(6);
  });
});
