/*
import React, { useState, useEffect } from 'react'
import { Recorder } from "react-voice-recorder";
// import "react-voice-recorder/dist/index.css";
import './App.css'

// ---------------------
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'
var a;

function App() 
{
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])
  //  --------------------------------------------------------- 

    // --------------------------------------------------------
  const [buttonName, setButtonName] = useState("Play");
  const [audio, setAudio] = useState(); 

  useEffect(() => {
    if (a) {
      a.pause();
      a = null;
      setButtonName("Play");
    }
    if (audio) {
      a = new Audio(audio);
      a.onended = () => {
        setButtonName("Play");
      };
    }
  }, [audio]);

  const handleClick = () => {
    if (buttonName === "Play") {
      a.play();
      setButtonName("Pause");
    } else {
      a.pause();
      setButtonName("Play");
    }
  };

  const addFile = (e) => {
    if (e.target.files[0]) {
      setAudio(URL.createObjectURL(e.target.files[0]));
    }
  };
// --------------------------------------------------------

  useEffect(() => {
    handleListen()
  }, [isListening])

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note])
    setNote('')
  }

  return (
    <>
      <h1>Amharic Speech-to-Text App</h1>
      <div className="container">
        <div className="box">
          <h3>Record or Upload your speech</h3>
          <div class="centered-div pad">
            {isListening ? <span class='pad'>🎙️</span> : <span>🛑🎙️</span>}
            <button onClick={handleSaveNote} disabled={!note}>
              Predict
            </button>             
            <button onClick={() => setIsListening(prevState => !prevState)}>
              Start/Stop Recording
            </button>
          </div><br/><br/><br/><hr/>
          <div class="centered-div pad"> 
            <button onClick={handleSaveNote} disabled={!note}>
                Predict
            </button> 
            <button onClick={handleClick} buttontype="primary">{buttonName}</button>
            <input type="file" onChange={addFile} accept=".wav, .mp3" /> 
            {/* <p>{note}</p> }             
          </div>
        </div>
        <div className="box">
          <h3>Predicted Transcription</h3>
          {savedNotes.map(n => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </>
  )
}

export default App

*/
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
        <h2> Amharic/Swahili Text-to-Speech App</h2><br/>
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
