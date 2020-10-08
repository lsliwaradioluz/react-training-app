import { React, styled, colors, connect } from "src/imports/react";
import { Header, Carousel, Button, Icon } from "src/imports/components";
import DefaultLayout from "src/layouts/Default";
import Slide from "src/components/Dashboard/Slide"
import { setNotification } from "src/store/actions/main";

const Dashboard = (props) => {
  const getFirstName = () => {
    return props.user.fullname.split(" ")[0];
  };

  const slides = [
    {
      title: "Ćwiczenia dopasowane do Ciebie",
      caption:
        "Aplikacja Piti czerpie z gimnastyki, Crossfitu oraz Animal Flow i zawiera ponad 100 ćwiczeń",
      link: "/exercises",
      image:
        "https://images.unsplash.com/photo-1581009137042-c552e485697a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    },
    {
      title: "Wszystko w jednym miejscu",
      caption: "Aplikacja Piti to Twoje nowe centrum treningowe",
      link: "/workouts",
      image:
        "https://images.unsplash.com/photo-1544216717-3bbf52512659?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    },
  ];

  const slideNodes = slides.map((slide, index) => (
    <Slide slide={slide} key={index} />
  ));

  return (
    <DefaultLayout>
      <Header>Cześć, {getFirstName()}!</Header>
      <Carousel elementWidth={0.9} hideIndicators>
        {slideNodes}
      </Carousel>
    </DefaultLayout>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.main.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (n) => dispatch(setNotification(n)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
