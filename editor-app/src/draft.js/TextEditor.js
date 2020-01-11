/* eslint-disable react/no-multi-comp */
import React, { Component } from "react";

import Editor, { createEditorStateWithText } from "draft-js-plugins-editor";

import createToolbarPlugin, { Separator } from "draft-js-static-toolbar-plugin";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from "draft-js-buttons";
import editorStyles from "../css//editorStyles.css";
import "draft-js-static-toolbar-plugin/lib/plugin.css";
import "../css/index.css";
import { convertToHTML } from "draft-convert";
import axios from "axios";
import renderHTML from 'react-render-html'

class HeadlinesPicker extends Component {
  componentDidMount() {
    setTimeout(() => {
      window.addEventListener("click", this.onWindowClick);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onWindowClick);
  }

  onWindowClick = () =>
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    this.props.onOverrideContent(undefined);

  render() {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    return (
      <div>
        {buttons.map((
          Button,
          i // eslint-disable-next-line
        ) => (
          <Button key={i} {...this.props} />
        ))}
      </div>
    );
  }
}


class HeadlinesButton extends Component {
  onClick = () =>
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    this.props.onOverrideContent(HeadlinesPicker);


  render() {
    return (
      <div className="headlineButtonWrapper">
        <button onClick={this.onClick} className="headlineButton">
          <i className="fas fa-heading"></i>
        </button>
      </div>
    );
  }
}

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];
const text =
  "In this editor a toolbar shows up once you select part of the text …";

export default class CustomToolbarEditor extends Component {
  constructor() {
    super();

    this.state = {
      something: null,
      editorState: createEditorStateWithText(text)
    };
    console.log(this.state.editorState.getCurrentContent());
  }
getNote = async () => {
  let note = await axios.get('http://localhost:5000/api/notes/15')
  console.log(renderHTML(note.data.body))
  this.setState({
    something: renderHTML(note.data.body)
  })
  console.log(this.state.something)
}

// getNote()

componentDidMount() {
  this.getNote()
}

  onChange = editorState => {
    this.setState({
      editorState
    });
  };

  focus = () => {
    this.editor.focus();
  };

  publishNote = () => {
    const html = convertToHTML(this.state.editorState.getCurrentContent());

    const post = {
      body: html
    };

    axios.post("http://localhost:5000/api/notes", post, (req, res) => {
      console.log('hello')
      res.status(201).json(post)
    });
    console.log('hello')
  }

  render() {
    return (
      <div className="editor-div">
        <header className="toolbar-header">
          {" "}
          <Toolbar>
            {// may be use React.Fragment instead of div to improve perfomance after React 16
            externalProps => (
              <div className="button-menu">
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <Separator {...externalProps} />
                <HeadlinesButton {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
              </div>
            )}
          </Toolbar>
          <button onClick={this.publishNote}>enter</button>
        </header>

        <div className={editorStyles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={element => {
              this.editor = element;
            }}
          />
        </div>
        <div className='render-test'>{this.state.something}</div>
      </div>
    );
  }
}
