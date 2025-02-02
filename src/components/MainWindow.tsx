import Automation from "./Automation";
import TextInput from "./TextInput";
import VoiceBot from "./VoiceBot";
import { useRouter } from "next/navigation";

const MainWindow = ({selectedMethod}:{selectedMethod: string|null}) => {

  const router = useRouter();

  const Methods = [
    "Chat Bot",
    "Task Automation",
    "Voice Bot",
    "Translator",
    "Logout"
  ];

  const LogoutFunc = async() => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (res.ok){
        router.push("/login");
      }
    } catch (error) {
      console.log("Error Logging Out: ",error)
    }
  }

   const renderContent = () => {
    switch (selectedMethod) {
      case 'Chat Bot':
        return <TextInput />;
      case 'Task Automation':
        return <Automation />;
      case "Voice Bot":
        return <VoiceBot />
      case 'Translator':
        return <div>Translator functionality goes here...</div>;
      case "Logout":
        LogoutFunc();
        break;
      default:
        return <div>Select a functionality to view details.</div>;
    }
  };

  return (
    <div className="p-5 flex flex-col justify-center items-center w-full">
      <h2 className="text-2xl font-bold mb-4">
        {!selectedMethod && 'Select a Functionality'}
      </h2>
      {renderContent()}
    </div>
  )
}

export default MainWindow