const path = require('path')
const express = require('express')
const app = express()

const multer  = require('multer')
const upload = multer()

const transcribe = require('./transcribe')

app.use(express.static(path.join(__dirname, 'build')))

app.post('/api/transcribe', upload.single('file'), async function (req, res) {
	const results = await transcribe.syncRecognize((req.file.buffer.toString('base64')))
	res.send(results)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'/build/index.html'))
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})