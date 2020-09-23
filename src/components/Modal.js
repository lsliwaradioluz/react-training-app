import { React, styled } from "src/imports/react";

const Modal = (props) => {
  const onClickHandler = (event) => {
    if (event.target.id !== "content" || !props.onClick) {
      return
    }
    props.onClick()
  };

  return (
    <$Modal>
      <$ModalBackdrop />
      <$ModalContent id="content" onClick={onClickHandler}>{props.children}</$ModalContent>
    </$Modal>
  );
};

const $Modal = styled.div`
  position: absolute;
`;

const $ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  max-width: 450px;
  background-color: rgba(0, 0, 0, 0.678);
  z-index: 1001;
`;

const $ModalContent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  max-width: 450px;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 1rem;
`;

export default Modal;
