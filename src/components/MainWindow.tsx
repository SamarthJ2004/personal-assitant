import TextInput from "./TextInput";

const MainWindow = ({selectedMethod}:{selectedMethod: string|null}) => {

  const Methods = [
    "Chat Bot",
    "Task Automation",
    "Content Generation",
    "Summarization",
    "Coder",
    "Translator",
  ];

   const renderContent = () => {
    switch (selectedMethod) {
      case 'Chat Bot':
        return <TextInput />;
      case 'Task Automation':
        return <div>Task Automation functionality goes here...</div>;
      case 'Content Generation':
        return <div>Content Generation functionality goes here...</div>;
      case 'Summarization':
        return <div>Summarization functionality goes here...</div>;
      case 'Coder':
        return <div>Coder functionality goes here...</div>;
      case 'Translator':
        return <div>Translator functionality goes here...</div>;
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