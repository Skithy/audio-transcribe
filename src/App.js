import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    file: null,
    audioSrc: ""
  }

  handleFileAdd = e => {
    if (e.target.files.length > 0) {
      this.setState({file: e.target.files[0]})
    }
  }

  handleUpload = e => {
    e.preventDefault()
    if (this.state.file) {
      this.setState({audioSrc: URL.createObjectURL(this.state.file)})
      var data = new FormData()
      data.append('file', this.state.file)

      fetch('/api/transcribe', {
        method: 'POST',
        body: data
      }).then(e => console.log(e))
      // const reader = new FileReader()
      // reader.readAsArrayBuffer(this.state.file)
      // reader.onload = e => {
      //   const audioContext = new AudioContext()
      //   audioContext.decodeAudioData(reader.result).then(decodedBuffer => {
      //     console.log(decodedBuffer)
      //   })
      // }
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
        <audio
          controls
          src={this.state.audioSrc}>
          Browser does not support audio
        </audio>
      </div>
    );
  }
}

export default App;
