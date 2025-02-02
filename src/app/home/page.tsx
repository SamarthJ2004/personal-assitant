"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainWindow from "@/components/MainWindow";
import Options from "@/components/Options";

const Home = () => {
  const [selectedMethod, setSeletedMethod] = useState<string | null>(null);
  const Methods = ["Chat Bot", "Task Automation", "Voice Bot", "Translator", "Logout"];
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      console.log(document.cookie);
      if (!token) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className='flex justify-center items-center h-full w-full'>
      <div className='w-[86%] h-[86%] bg-slate-500 rounded-2xl flex'>
        <ul className='w-[30%] bg-slate-600 rounded-l-2xl flex flex-col items-center py-8 overflow-scroll'>
          {Methods.map((method, index) => (
            <Options key={index} method={method} selectedMethod={selectedMethod} setSelectedMethod={setSeletedMethod} />
          ))}
        </ul>
        <MainWindow selectedMethod={selectedMethod} />
      </div>
    </div>
  );
};

export default Home;