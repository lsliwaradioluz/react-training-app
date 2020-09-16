import { React, Component, styled, colors, connect } from "src/imports/react";
import { Icon, Spinner, Button } from "src/imports/components";
import { setNotification } from "src/store/actions";

class FileInput extends Component {
  state = {
    file: this.props.file || null, 
    loading: false,
  }

  hiddenInputRef = React.createRef();

  commenceFileUpload = () => {
    this.hiddenInputRef.current.click();
  };

  uploadFile = () => {
    const file = this.hiddenInputRef.current.files[0];
    if (file.type !== "video/mp4") {
      this.props.setNotification(
        "W tym miejscu możesz załączyć jedynie film w formacie mp4."
      );
      return;
    }
    this.setState({ loading: true })
    
    const formData = new FormData();
    formData.append("image", file);
    // const endpoint = `${process.env.endpoint}/api/upload-file`
    const endpoint = "http://localhost:1337/api/upload-file"
    fetch(endpoint, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.setState({ loading: false, file: data })
        this.props.onUploadFinish(data)
      })
      .catch(() => {
        this.setState({ loading: false })
        this.props.setNotification("Nie udało się wykonać operacji. Sprawdź połączenie z Internetem")
      });
  };

  deleteFile = () => {
    // const endpoint = `${process.env.endpoint}/api/delete-file`
    const endpoint = "http://localhost:1337/api/delete-file"
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.file),
    });
    this.props.onDeleteFile(null)
    this.setState({ file: null })
  }

  render() {
    let view = (
      <$FileInput onClick={this.commenceFileUpload}>
        <$HiddenInput
          ref={this.hiddenInputRef}
          name="image"
          type="file"
          onChange={this.uploadFile}
          accept=".mp4"
        />
        <$FileInputIcon name="plus" />
        <$FileInputText>Kliknij tutaj, aby dodać film</$FileInputText>
      </$FileInput>
    )

    if (this.state.loading && !this.state.file) {
      view = (
        <$FileInput>
          <Spinner />
        </$FileInput>
      )
    }

    if (!this.state.loading && this.state.file) {
      view = <Button theme="secondary" click={this.deleteFile}>Usuń plik</Button>
    }

    return view;
  }
}

const $FileInput = styled.div`
  border: 1px solid ${colors.faded};
  color: ${colors.faded};
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  padding: 3rem 2rem;
`;

const $HiddenInput = styled.input`
  display: none;
`;

const $FileInputIcon = styled(Icon)`
  font-size: 32px;
`;

const $FileInputText = styled.p`
  font-size: 0.8rem;
  text-align: center;
  margin-bottom: 0;
  margin-top: 0.5rem;
`;



const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(null, mapDispatchToProps)(FileInput);
