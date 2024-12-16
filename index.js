const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { SpeechClient } = require('@google-cloud/speech');

// Path to the audio file you want to transcribe
const audioFile = 'audio.mp3';

// Google Cloud Speech client
const client = new SpeechClient();

// Function to transcribe audio
async function transcribeAudio() {
  const fileName = path.join(__dirname, audioFile);

  // Read the audio file
  const audio = fs.readFileSync(fileName);
  const audioBytes = audio.toString('base64');

  // Configure the audio input and recognition settings
  const request = {
    audio: {
      content: audioBytes,
    },
    config: {
      encoding: 'MP3',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    },
  };

  // Send the request to the Google Cloud Speech API
  const [response] = await client.recognize(request);

  // Output the transcription
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: ${transcription}`);
}

// Convert video to MP4
ffmpeg('video.mp4')
  .output('output_video.mp4')
  .on('end', function () {
    console.log('Video conversion finished!');
  })
  .on('error', function (err) {
    console.log('Error: ' + err.message);
  })
  .run();

// Extract audio from video
ffmpeg('video.mp4')
  .noVideo()
  .audioCodec('libmp3lame')
  .output('audio.mp3')
  .on('end', function () {
    console.log('Audio extraction finished!');
    transcribeAudio(); // Call transcription after audio extraction
  })
  .on('error', function (err) {
    console.log('Error: ' + err.message);
  })
  .run();

  const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('AI Video Editor is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

