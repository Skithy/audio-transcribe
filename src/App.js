import React, { Component } from 'react'
import { fileToMonoWav } from './services/audioTools'
import './App.css'

class App extends Component {
  state = {
    file: null,
    audioSrc: "",
    transcription: null
  }

  handleFileAdd = e => {
    if (e.target.files.length > 0) {
      this.setState({file: e.target.files[0]})
    }
  }

  handleUpload = async(e) => {
    e.preventDefault()
    try {
      if (this.state.file) {
        this.setState({transcription: "Converting..."})
        const file = await fileToMonoWav(this.state.file)
        this.setState({
          audioSrc: URL.createObjectURL(file),
          transcription: "Transcribing..."
        })
        const results = await this.sendFile(file)
        this.setState({transcription: results.transcript})
      }
    }
    catch (err) {
      console.log("Error: " + err)
    }
  }

  sendFile = async(file) => {
    var data = new FormData()
    data.append('file', file)

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: data
    })
    const result = await response.json()
    return result
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleUpload}>
          <input
            type="file"
            name="audio"
            accept="audio/*"
            onChange={this.handleFileAdd}
          />
          <button disabled={!this.state.file}>
            Upload
          </button>
        </form>
        <audio
          controls
          src={this.state.audioSrc}>
          Browser does not support audio
        </audio>
        <div>
          {this.state.transcription}
        </div>
      </div>
    );
  }
}

export default App;
