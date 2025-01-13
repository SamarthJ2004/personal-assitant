"use client"
import { useState } from "react";
import ReminderEmail from "./ReminderEmail";
import WeatherUpdate from "./WeatherUpdate";
import MediaPosting from "./MediaPosting";
import CryptoAlertForm from "./StockPrice";

const Automation = () => {
  const [automation,setAutomation] = useState<string|null>(null);

  const automations = ["Reminder Email","Weather Update","Media Posting","Stock Price Checker"];

  const renderContent = () => {
    switch (automation){
      case "Reminder Email":
        return <ReminderEmail setAutomation= {setAutomation}/>;
      case "Weather Update":
        return <WeatherUpdate />;
      case "Media Posting":
        return <MediaPosting />;
      case "Stock Price Checker":
        return <CryptoAlertForm setAutomation={setAutomation}/>;
      default:
        return (
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-10">Choose an Automation</h1>
            <ul className="grid grid-cols-2 gap-5 select-none">
              {automations.map((automata, index)=> (
                <li key={index} className={`${automata===automation?'font-bold':""} bg-slate-900 p-5 text-center rounded-xl pointer`} onClick={()=> setAutomation(automata)}>{automata}</li>
              ))}
            </ul>
          </div>
        )
    }
  }

  return (
    <>
    {renderContent()}
    </>
  )
}

export default Automation