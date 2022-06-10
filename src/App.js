import React from "react";
import { Recorder } from "react-voice-recorder";
import {axios} from 'axios';
import "react-voice-recorder/dist/index.css";
import "./App.css";

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      savedNotes:"text",
      results:{},
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
            this.setState({results:result})
          })
        })
      });
    }
    // const audiofile = new Blob(data.chunks, {type:'audio/wav; codecs=MS_PCM'});
    // const audiofile = new File([data.blob], `test+${Math.random()}.wav`, { type: "audio/wav" })
    
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
              handleReset={() => this.handleReset()}
            /></h4>
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
