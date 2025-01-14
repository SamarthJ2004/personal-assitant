import { FaRobot, FaTasks, FaLanguage, FaVoicemail} from 'react-icons/fa';

const Options = ({method,selectedMethod,setSelectedMethod}: {method: string,selectedMethod:string|null,setSelectedMethod: (value: string|null) => void}) => {

  const getIcon = (method: string) => {
    switch (method) {
      case 'Chat Bot':
        return <FaRobot />;
      case 'Task Automation':
        return <FaTasks />;
      case "Voice Bot":
        return <FaVoicemail />
      case 'Translator':
        return <FaLanguage />;
      default:
        return null;
    }
  };

  return (
    <li className={`cursor-pointer text-white ${selectedMethod === method ? 'font-bold' : ''} w-[80%] bg-gray-800 mb-2 p-5 rounded-lg text-lg select-none`} onClick={()=> setSelectedMethod(method)}>
      {getIcon(method)} {method}
    </li>
  )
}

export default Options;