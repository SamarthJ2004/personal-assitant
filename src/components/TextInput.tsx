"use client"
import { useState,useEffect } from "react";

const TextInput = () => {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState<string[]>(() => {
    const jsonResponse = localStorage.getItem('responses');
    return jsonResponse ? JSON.parse(jsonResponse): [];
  });

  useEffect(() => {
    localStorage.setItem('responses', JSON.stringify(responses));
  }, [responses]);

  const sendMessage = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      console.log(data);
      setResponses(prevResponses => {
        const updatedResponses = [...prevResponses, message, data];
        return updatedResponses.length > 16 ? updatedResponses.slice(updatedResponses.length - 16) : updatedResponses;
      });
      setMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='w-full flex flex-col justify-center h-full'>
      <div className='flex flex-col items-center overflow-scroll mb-2 h-[78%]'>
        {responses.map((res, index) => (
          <p key={index} className={`${index%2?'bg-gray-600 mb-5':'bg-zinc-500 mb-1'} rounded-xl p-4 w-[80%]`}>{res}</p>
        ))}
      </div>
      <div className='flex justify-center items-center'>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-slate-300 w-[70%] h-8 rounded-2xl p-5 text-black outline-none"
          placeholder='Type your message here'
        />
        <button onClick={sendMessage} disabled={message.length==0} className='bg-white w-16 h-9 rounded-xl ml-3 text-black disabled:opacity-50 disabled:cursor-not-allowed'>Send</button>
      </div>
    </div>
  )
}

export default TextInput
