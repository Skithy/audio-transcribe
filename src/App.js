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
      if (this.validateFile(e.target.files[0])) {
        this.setState({file: e.target.files[0]})
        return
      alert("Invalid file type!")
    }
    this.setState({file: null})
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
        if (results) {
          this.setState({transcription: results.transcript})
        }
        else {
          alert("Failed to upload!")
        }
      }
    }
    catch (err) {
      console.log("Error: " + err)
    }
  }

  getExt = name => {
    const parts = name.split('.')
    return parts[parts.length - 1]
  }

  validateFile = file => {
    const fileTypes = [
      "wav", "mp3", "wma",
      "aac", "ogg", "raw",
      "m4a", "mp4",
      "alac", "aiff", "flac"
    ]
    return fileTypes.includes(this.getExt(file.name).toLowerCase())
  }

  sendFile = async(file) => {
    try {
      var data = new FormData()
      data.append('file', file)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: data
      })
      return await response.json()
    }
    catch (err) {
      console.log("Upload error: " + err)
      return null
    }
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
        <audio controls
          src={this.state.audioSrc}>
          Browser does not support audio
        </audio>
        <div>
          {this.state.transcription}
        </div>
      </div>
    )
  }
}

export default App
