"use client";
import { useState, useEffect, useRef } from 'react';

export default function VoiceBot() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responses, setResponses] = useState<string[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Try Chrome.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const currentTranscript = event.results[event.results.length - 1][0].transcript.trim();
      if (currentTranscript) {
        setTranscript(currentTranscript);
        sendToOpenAI(currentTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const sendToOpenAI = async(transcript: string) => {
    try {
      const response = await fetch("/api/voice",{
        method: "POST",
        headers: {
          "Content-Type":"application/json",
        },
        body: JSON.stringify(transcript),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from Open AI");
      }

      const data = await response.json();

      setResponses([...responses, transcript, data]);
      setTranscript("");
    } catch (error) {
      console.log("Error sending voice mail: ", error)
    }
  }

  return (
    <div className="w-full flex flex-col justify-center h-full bg-slate-400">
      <div className='flex flex-col items-center overflow-scroll mb-2 h-[78%]'>
        {responses.map((res, index) => (
          <p key={index} className={`${index % 2 ? 'bg-gray-600 mb-5' : 'bg-zinc-500 mb-1'} rounded-xl p-4 w-[80%]`}>{res}</p>
        ))}
      </div>
      <div className="flex flex-col items-center">
        <button
          onClick={listening ? stopListening : startListening}
          className={`px-4 py-2 rounded text-white ${listening ? 'bg-red-500' : 'bg-blue-500'}`}
        >
          {listening ? 'Stop Listening' : 'Start Listening'}
        </button>
        <p className="mt-4">Transcript: {transcript}</p>
      </div>
    </div>
  );
}