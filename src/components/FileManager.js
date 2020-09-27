import { React, Component, styled, connect } from "src/imports/react";
import { Button } from "src/imports/components";
import { setNotification, setLoading } from "src/store/actions";

class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: this.props.file || null,
    };
    this.hiddenInputRef = React.createRef();
    this.initialFile = null
  }

  componentDidMount() {
    this.initialFile = this.props.file
  }

  componentWillUnmount() {
    if (this.props.removeFileOnUnmount && this.state.file) {
      this.removeFileFromDb(this.state.file)
    } else if (this.props.removeInitialFile && this.initialFile) {
      this.removeFileFromDb(this.initialFile)
    }
  }

  commenceFileUpload = () => {
    this.hiddenInputRef.current.click();
  };

  uploadFile = () => {
    const file = this.hiddenInputRef.current.files[0];
    
    if (
      this.props.allowedFormat &&
      !file.type.includes(this.props.allowedFormat)
    ) {
      this.props.setNotification("Pliki w tym formacie nie są akceptowane!");
      return;
    }

    this.props.setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    // const endpoint = `${process.env.endpoint}/api/upload-file`
    const endpoint = "http://localhost:1337/api/upload-file";
    fetch(endpoint, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (this.state.file && this.initialFile !== this.state.file) {
          this.removeFileFromDb(this.state.file)
        }
        this.setState({ file: data });
        this.props.onUploadFinish(data);
        this.props.setLoading(false);
      })
      .catch(() => {
        this.props.setLoading(false);
        this.props.setNotification(
          "Nie udało się wykonać operacji. Sprawdź połączenie z Internetem"
        );
      });
  };

  deleteFile = () => {
    if (this.initialFile !== this.state.file) {
      this.removeFileFromDb(this.state.file)
    }
    this.props.onFileDelete();
    this.setState({ file: null });
  };

  removeFileFromDb(file) {
    // const endpoint = `${process.env.endpoint}/api/delete-file`
    const endpoint = "http://localhost:1337/api/delete-file";
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(file),
    });
  }

  render() {
    return (
      <$FileManager className={this.props.className}>
        <$HiddenInput
          ref={this.hiddenInputRef}
          name="image"
          type="file"
          onChange={this.uploadFile}
        />
        <Button theme="tertiary" click={this.commenceFileUpload}>
          {this.props.addButtonCaption || "Dodaj plik"}
        </Button>
        {this.state.file ? (
          <Button theme="tertiary" click={this.deleteFile}>
            {this.props.deleteButtonCaption || "Usuń plik"}
          </Button>
        ) : null}
      </$FileManager>
    );
  }
}

const $FileManager = styled.div`
  display: flex;
`;

const $HiddenInput = styled.input`
  display: none;
`;

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
    setLoading: (loading) => dispatch(setLoading(loading)),
  };
};

export default connect(null, mapDispatchToProps)(FileManager);
