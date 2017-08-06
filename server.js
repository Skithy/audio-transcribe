const path = require('path')
const express = require('express')
const app = express()

const multer  = require('multer')
const upload = multer()

const Speech = require('@google-cloud/speech');
const speech = Speech();

app.use(express.static(path.join(__dirname, 'build')))

app.post('/api/transcribe', upload.single('file'), function (req, res) {
	syncRecognize(req.file.buffer.toString('base64'), res)
  res.send("Hello")
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'/build/index.html'))
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})

function syncRecognize(content, res) {
  const Speech = require('@google-cloud/speech');

  const speech = Speech();
  const encoding = 'LINEAR16';
  const sampleRateHertz = 16000;
  const languageCode = 'en-US';

  const config = {
  	enableWordTimeOffsets: true,
    encoding: encoding,
  	sampleRateHertz: sampleRateHertz,
    languageCode: languageCode
  };
  const audio = {
    content: content
  };

  const request = {
    config: config,
    audio: audio
  };

  console.log("Text sent")
  speech.recognize(request)
    .then((results) => {
      const transcription = results[0].results[0].alternatives[0].transcript;
      console.log(`Transcription: `, transcription);
      results[0].results[0].alternatives[0].words.forEach((wordInfo) => {
        // NOTE: If you have a time offset exceeding 2^32 seconds, use the
        // wordInfo.{x}Time.seconds.high to calculate seconds.
        const startSecs = `${wordInfo.startTime.seconds}` + `.` +
            (wordInfo.startTime.nanos / 100000000);
        const endSecs = `${wordInfo.endTime.seconds}` + `.` +
            (wordInfo.endTime.nanos / 100000000);
        console.log(`Word: ${wordInfo.word}`);
        console.log(`\t ${startSecs} secs - ${endSecs} secs`);
      });
    })
    .catch((err) => {
      console.error('ERROR:', err);
    })
}