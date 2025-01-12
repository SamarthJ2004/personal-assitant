"use client"
import React, { useState } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  to: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(5, { message: "Subject too short" }).max(50, { message: "Subject too long" }),
  timeToSend: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const ReminderEmail = ({ setAutomation }: { setAutomation: (value: string | null) => void }) => {
  const { register, handleSubmit,reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const [emailPreview, setEmailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.subject),
      });

      if (!response.ok) throw new Error('Failed to generate email preview');

      const botMessage = await response.json();
      setEmailPreview(botMessage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scheduleEmail = async(data: FormData, emailPreview : string) => {
    try {
      const response = await fetch('api/email', {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({recipientEmail: data.to,subject: data.subject,sendTime: data.timeToSend,emailContent: emailPreview}),
      });

      if (!response.ok) throw new Error('Failed to schedule email');
      console.log("Scheduling Response: ",response);
      alert("Email scheduled successfully");
      reset();
      setAutomation(null);
      setEmailPreview(null);
    }catch (error){
      console.error("Scheduling Error",error);
    }
  };

  return (
    <div className="h-full w-full px-10 py-5">

      <FaArrowCircleLeft size={30} onClick={() => setAutomation(null)} />

      <div className="h-[90%] flex flex-col justify-center items-center text-black">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
          <input type="email" {...register('to')} placeholder="Recipient's Email" className="mb-4 block text-white text-bold w-full p-2 border rounded-lg"/>
          {errors.to && <p>{errors.to.message}</p>}
          <input type="text" {...register('subject')} placeholder="Email Subject" className="mb-4 block text-white text-bold w-full p-2 border rounded-lg"/>
          {errors.subject && <p>{errors.subject.message}</p>}
          <input type="datetime-local" {...register('timeToSend')} placeholder="Time to Send" className="mb-4 block text-bold w-full p-2 border rounded-lg"/>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Preview Email'}
          </button>
        </form>
        {emailPreview && (
          <div className="mt-6 p-4 border bg-gray-100 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">Email Preview:</h3>
            {emailPreview}
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleSubmit((data) => scheduleEmail(data,emailPreview))()}>
              Confirm & Schedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderEmail;