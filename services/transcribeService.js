const Speech = require('@google-cloud/speech');
const speech = Speech();

exports.asyncRecognize = content => {
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

  console.log("Request received")
  return speech.longRunningRecognize(request)
    .then((results) => {
      console.log("Request acknowledged")
      const operation = results[0];
      return operation.promise();
    })
    .then((results) => {
      console.log("Transcription recieved")
      const transcription = results[0].results[0].alternatives[0];
      return transcription
    })
    .catch((err) => {
      console.error('ERROR:', err);
    })
}
