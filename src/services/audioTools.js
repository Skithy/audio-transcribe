import wav from './wav'
const audioContext = new AudioContext()

function fileToArrayBuffer(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
	  reader.onload = () => resolve(reader.result)
	  reader.onerror = () => {
	  	throw new Error("Failed to read!")
	  }
	  reader.readAsArrayBuffer(file)
	})  
}

function convertToMono(audioBuffer) {
	if (audioBuffer.numberOfChannels === 1) {
    return audioBuffer
  }
  const channels = [...Array(audioBuffer.numberOfChannels)].map((val, i) => audioBuffer.getChannelData(i))
  const newBuffer = audioContext.createBuffer(1, audioBuffer.length, audioBuffer.sampleRate)
  let nowBuffering = newBuffer.getChannelData(0)
  for (let i = 0; i < audioBuffer.length; i++) {
    let total = 0
    for (let j = 0; j < channels.length; j++) {
      total += channels[j][i]
    }
    nowBuffering[i] = total / channels.length
  }
  return newBuffer
}


export async function fileToMonoWav(file) {
	const arrayBuffer = await fileToArrayBuffer(file)
	const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
	const monoAudioBuffer = convertToMono(audioBuffer)
	
	const wavBuffer = wav.encode(
		[monoAudioBuffer.getChannelData(0)],
		{sampleRate: monoAudioBuffer.sampleRate}
	)
	const blob = new Blob(
		[wavBuffer],
		{type: 'audio/wav'}
	)
  const wavFile = new File([blob], "test.wav")
  return wavFile
}
