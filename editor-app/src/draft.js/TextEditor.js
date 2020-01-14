/* eslint-disable react/no-multi-comp */
import React, { Component } from "react";
//editor
import Editor from "draft-js-plugins-editor";
import {EditorState} from 'draft-js'
import { convertToHTML, convertFromHTML } from "draft-convert";
import renderHTML from "react-render-html";

//plugins
import createToolbarPlugin, { Separator } from "draft-js-static-toolbar-plugin";
import createHashtagPlugin from 'draft-js-hashtag-plugin';

//buttons
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton
} from "draft-js-buttons";

//styling
import editorStyles from "../css//editorStyles.css";
import "draft-js-static-toolbar-plugin/lib/plugin.css";
import 'draft-js-hashtag-plugin/lib/plugin.css';
import "../css/index.css";

import axios from "axios";

const hashtagPlugin = createHashtagPlugin()
const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin, hashtagPlugin];




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


const text =
  "<p>In this editor a toolbar shows up once you select part of the text …</p><h1>asdfasdf</h1><h2>asdfasdf</h2><h3>asdfasdf</h3><ul><li>asdfasdf</li><li><strong>asdfasdf</strong></li><li><strong><em>asdfasdf</em></strong></li></ul><ol><li><strong><em><u>asdfasdf</u></em></strong></li><li><strong><em><u>awesome</u></em></strong></li></ol><blockquote><strong><em>asdfasdfasdfasdf</em></strong></blockquote>";

  
export default class CustomToolbarEditor extends Component {
  constructor() {
    super();
    this.state = {
      something: null,
      editorState: EditorState.createWithContent(convertFromHTML(text))
    };
    console.log(this.state.editorState.getCurrentContent());
  }
  getNote = async () => {
    let note = await axios.get("http://localhost:5000/api/notes/20");
    // console.log(renderHTML(note.data.body));
    this.setState({
      something: renderHTML(note.data.body)
    });
    console.log(this.state.something);
  };

  // getNote()

  componentDidMount() {
    this.getNote();
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
      console.log("hello");
      res.status(201).json(post);
    });
    console.log("hello");
  };

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
              <div className='render-test'>{this.state.something}</div>
        <div className={editorStyles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={element => {
              this.editor = element;
            }}
            // spellCheck={true}
          />
        </div>
        {/* <div className="render-test">{this.state.something}</div> */}
      </div>
    );
  }
}
