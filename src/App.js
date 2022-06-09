import React from "react";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";
import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioURL: null,
      audioDetails: {
        url: null,
        blob: null,
        chunks: null,
        duration: {
          h: 0,
          m: 0,
          s: 0
        }
      }
    };
  }
  handleAudioStop(data) {
    console.log(data);
    this.setState({ audioDetails: data });
    console.log(data);
  }
  handleAudioUpload(file) {
    console.log(file);
  }
  handleRest() {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0
      }
    };
    this.setState({ audioDetails: reset });
  }
  render() {
    return (
      <div className="container"> 
        <h2> Swahili Speech-To-Text Web Application</h2><br/>
        <div className="box">
            <h4>
            <Recorder className="block"
              record={true}
              title={"Speeches Data to be Predicted"}
              audioURL={this.state.audioDetails.url}
              showUIAudio
              handleAudioStop={(data) => this.handleAudioStop(data)}
              handleAudioUpload={(data) => this.handleAudioUpload(data)}
              handleRest={() => this.handleRest()}
            /></h4>
            <button onClick="{handleSaveNote}" disabled="{!note}">
                Predict
            </button>
          </div>
          <div className="box"><br/>
            <h2 className="block">Predicted Transcription</h2>
            <div className="">
              {/* {savedNotes.map(n => (
                <p key={n}>{n}</p>
              ))} */}
            </div>
        </div>
      </div>
    );
  }
}
