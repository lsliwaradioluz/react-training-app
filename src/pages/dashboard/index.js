import { React, styled, colors, connect } from "src/imports/react";
import { Header, Carousel, Button, Icon } from "src/imports/components";
import DefaultLayout from "src/layouts/Default";
import { setNotification } from "src/store/actions";

const Dashboard = (props) => {
  const getFirstName = () => {
    return props.user.fullname.split(" ")[0];
  };

  const slides = [
    {
      title: "Ćwiczenia dopasowane do Ciebie",
      caption:
        "Aplikacja Piti czerpie z gimnastyki, Crossfitu oraz Animal Flow i zawiera ponad 100 ćwiczeń",
      image:
        "https://images.unsplash.com/photo-1581009137042-c552e485697a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    },
    {
      title: "Wszystko w jednym miejscu",
      caption: "Aplikacja Piti to Twoje nowe centrum treningowe",
      image:
        "https://images.unsplash.com/photo-1544216717-3bbf52512659?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    },
    {
      title: "Wszystko w jednym miejscu",
      caption: "Aplikacja Piti to Twoje nowe centrum treningowe",
      image:
        "https://images.unsplash.com/photo-1536922246289-88c42f957773?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1380&q=80",
    },
    {
      title: "Wszystko w jednym miejscu",
      caption: "Aplikacja Piti to Twoje nowe centrum treningowe",
      image:
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    },
  ];

  const slideNodes = slides.map((slide, index) => (
    <$Slide image={slide.image} key={index}>
      <div>
        <h3>{slide.title}</h3>
        <p>{slide.caption}</p>
      </div>
    </$Slide>
  ));

  return (
    <DefaultLayout>
      <Header>Cześć, {getFirstName()}!</Header>
      <Carousel elementWidth={0.9} hideIndicators>
        {slideNodes}
      </Carousel>
      <button onClick={props.setNotification.bind(this, "Dupa jasiu karuzela")}>Pokaż powiadomienie</button>
    </DefaultLayout>
  );
};

const $Slide = styled.div`
  padding: 1rem 1rem 1rem 0;
  &:last-child {
    padding-right: 0;
  }
  div {
    background: linear-gradient(
        to top,
        rgba(250, 250, 250, 1) 0%,
        rgba(250, 250, 250, 0) 70%
      ),
      url("${(props) => props.image}") center;
    background-size: cover;
    padding: 1rem;
    border-radius: 30px;
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  h3 {
    margin: 0;
    font-weight: 500;
    color: black;
  }
  p {
    margin: 0;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.8);
  }
`;

const $Button = styled.button`
  color: black;
`;

const mapStateToProps = (state) => {
  return {
    user: state.main.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setNotification: (n) => dispatch(setNotification(n)) 
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
