import React from "react";
import { Recorder } from "react-voice-recorder";
import {axios} from 'axios';
import "react-voice-recorder/dist/index.css";
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import "./App.css";

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      savedNotes:"text",
      results:{},
      recordState: null,
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
  
  handleAudioStop(data){
    console.log(data);
    var toWav = require('audiobuffer-to-wav')
    this.setState({ audioDetails: data });
    console.log(data);
    const reader = new window.FileReader();
    reader.readAsDataURL(data.blob);
    reader.onloadend = () => {
      let base64 = reader.result + '';
      base64 = base64.split(',')[1];
      const ab = new ArrayBuffer(base64.length);
      const buff = new Buffer.from(base64, 'base64');
      const view = new Uint8Array(ab);
      for (let i = 0; i < buff.length; ++i) {
        view[i] = buff[i];
      }
      const context = new AudioContext();
      context.decodeAudioData(ab, (buffer) => {
        const wavFile = toWav(buffer);
        const blob = new window.Blob([ new DataView(wavFile) ], {
          type: 'audio/wav'
        });
        const url = window.URL.createObjectURL(blob);
        const audiofile = new File([blob], `test+${Math.random()}.wav`, { type: "audio/wav" })
        const formData = new FormData()
        formData.append('audio_file', audiofile)
        fetch('https://africanlp.herokuapp.com/stt/audio/', {
          method: 'POST',
          body: formData,
        }).then((resp) => {
          resp.json().then((result) => {
            console.log(result)
            this.setState({results:result})
          })
        })
      });
    }
    
    
  }
  
  upload = (e) => {
    console.warn(e.target.files)
    const files = e.target.files
    const formData = new FormData()
    formData.append('audio_file', files[0])
    fetch('https://africanlp.herokuapp.com/stt/audio/', {
      method: 'POST',
      body: formData,
    }).then((resp) => {
      resp.json().then((result) => {
        console.warn(result)
        this.setState({results:result})
      })
    })
  }
  handleReset() {
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
    
  }

  handleAudioUpload(data){
    console.log(data)
    window.alert("How to upload? In order to upload scroll the page below and find a button"+
    " named 'browse' click it and upload your .wav file. It must be a .wav file then click transcribe audio")
  }
  handleSaveNote = async () =>{
    console.log("result")
    const res = await this.state.results
    console.log(res.id)
    const formData = new FormData()
    formData.append('pk', res.id)
    fetch('https://africanlp.herokuapp.com/stt/sta/', {
      method: 'POST',
      body: formData,
    }).then((resp) => {
      resp.json().then((result) => {
        console.warn(result)
        this.setState({savedNotes:result.prediction})
      })
    })
    

    console.log(res)
    
  }
  start = () => {
    this.setState({
      recordState: RecordState.START
    })
  }
 
  stop = () => {
    this.setState({
      recordState: RecordState.STOP
    })
  }
 
  //audioData contains blob and blobUrl
  onStop = (audioData) => {
    console.log('audioData', audioData)
    const audiofile = new File([audioData.blob], `test+${Math.random()}.wav`, { type: "audio/wav" })
    const formData = new FormData()
    formData.append('audio_file', audiofile)
    fetch('https://africanlp.herokuapp.com/stt/audio/', {
      method: 'POST',
      body: formData,
    }).then((resp) => {
      resp.json().then((result) => {
        console.log(result)
        this.setState({results:result})
      })
    })
  }

  render() {
    const { recordState } = this.state

    return (
      <div className="container"> 
        <h2> Swahili Speech-To-Text Web Application</h2><br/>
        <div className="box">
            <div>
            <h4>
              {/* <AudioReactRecorder state={recordState} onStop={this.onStop} />
      
              <button onClick={this.start}>Start</button>
              <button onClick={this.stop}>Stop</button> */}
            
            <Recorder className="block"
              record={true}
              title={"Speeches Data to be Predicted"}
              audioURL={this.state.audioDetails.url}
              showUIAudio
              handleAudioStop={(data) => this.handleAudioStop(data)}
              handleAudioUpload={(data) => this.handleAudioUpload(data)}
              handleReset={() => this.handleReset()}
            />
            </h4>
            </div>
            <hr/>
            <input type='file' onChange={(e) => this.upload(e)} name='audio_file' />
            
            <button onClick={this.handleSaveNote}>
                Transcribe Audio
            </button>
          </div>
          <div className="box"><br/>
            <h2 className="block">Predicted Transcription Text</h2>
            <div className="">
                <p>{this.state.savedNotes}</p>
            </div>
        </div>
      </div>
    );
  }
}
