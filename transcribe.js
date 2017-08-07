const Speech = require('@google-cloud/speech');
const speech = Speech();

exports.syncRecognize = content => {
  const languageCode = 'en-US';

  const config = {
  	//enableWordTimeOffsets: true,
    languageCode: languageCode
  };
  const audio = {
    content: content
  };
  const request = {
    config: config,
    audio: audio
  };

  console.log("Request sent")
  return speech.longRunningRecognize(request)
    .then((results) => {
      console.log("Request acknowledged")
      const operation = results[0]
      return operation.promise()
    })
    .then((results) => {
      console.log("Transcription got")
      return transcription = results[0].results[0].alternatives[0]
    })
    .catch((err) => {
      console.error('ERROR:', err)
    })
}
