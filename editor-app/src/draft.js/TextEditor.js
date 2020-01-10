import React from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "../css/index.css";

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
    this.setEditor = editor => {
      this.editor = editor;
    };
    console.log(this.state.editorState);
    this.focusEditor = () => {
      if (this.editor) {
        this.editor.focus();
      }
    };
  }

  boldOnClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
  };

  italicOnClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
    );
  };

  underlineOnClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
    );
  };
  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  }

  //   publishPost = () => {
  //     // turn the state to html
  //     const html = convertToHTML(this.state.editorState.getCurrentContent());

  //     const post = {
  //         content: html,
  //         createdAt: new Date()
  //         // more stuff...
  //     }

  //     // post the data to you mongo storage.
  // }

  componentDidMount() {
    this.focusEditor();
  }

  blockStyleFn = contentBlock => {
    const type = contentBlock.getType();
    if (type === "blockquote") {
      return "superFancyBlockquote";
    }
  };

  render() {
    return (
        <div className='editor-div'>
        <div className="button-bar">
        {" "}
        <button className="bold-button" onClick={this.boldOnClick}>
          <i class="fas fa-bold"></i>
        </button>
        <button onClick={this.italicOnClick}>
          <i class="fas fa-italic"></i>
        </button>
        <button onClick={this.underlineOnClick}>
          <i class="fas fa-underline"></i>
        </button>
      </div>
      <div style={styles.editor} onClick={this.focusEditor} className='text-editor'>
        <Editor
          //   ref={this.setEditor}
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          blockStyleFn={this.blockStyleFn}
        />
      </div>
      </div>
    );
  }
}

const styles = {
  editor: {
    border: "1px solid gray",
    minHeight: "10em",
    // width: "50%",
    textAlign: "left",
    padding: 12
  }
};

export default TextEditor;
