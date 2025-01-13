"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowCircleLeft } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  currency: z.enum(['Ethereum', 'Bitcoin'], { message: "Currency must be Ethereum or Bitcoin" }),
  threshold: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Invalid threshold value" }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: "Invalid phone number" }),
});

type FormData = z.infer<typeof formSchema>;

const CryptoAlertForm = ({ setAutomation }: { setAutomation: (value: string | null) => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [prices, setPrices] = useState<{ Ethereum: number; Bitcoin: number }>({ Ethereum: 0, Bitcoin: 0 });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd');
        const data = await response.json();
        setPrices({
          Ethereum: data.ethereum.usd,
          Bitcoin: data.bitcoin.usd,
        });
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, []);

  const onSubmit = async (data: FormData) => {
    console.log(data);
    try {
      const response = await fetch('/api/stockAlert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });   

      if (response.ok) {
        console.log('Alert successfully created!');
      } else {
        console.error('Error creating alert');
      }
      reset();
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <div className="h-full w-full px-10 py-5">
      <FaArrowCircleLeft size={30} onClick={() => setAutomation(null)} />

      <div className="h-[90%] flex flex-col justify-center items-center text-black">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
          <div className="mb-4">
            <label className="block mb-1">Select Currency</label>
            <select
              {...register('currency')}
              className="block text-black text-bold w-full p-2 border rounded-lg"
            >
              <option value="">Select Currency</option>
              <option value="Ethereum">Ethereum - ${prices.Ethereum}</option>
              <option value="Bitcoin">Bitcoin - ${prices.Bitcoin}</option>
            </select>
            {errors.currency && <p>{errors.currency.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Threshold Price (USD)</label>
            <input
              type="text"
              {...register('threshold')}
              placeholder="Threshold Price"
              className="block text-black text-bold w-full p-2 border rounded-lg"
            />
            {errors.threshold && <p>{errors.threshold.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Phone Number</label>
            <input
              type="text"
              {...register('phoneNumber')}
              placeholder="Phone Number"
              className="block text-black text-bold w-full p-2 border rounded-lg"
            />
            {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Set Alert'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CryptoAlertForm;