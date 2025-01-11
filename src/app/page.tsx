import TextInput from "@/components/TextInput";
import Options from "@/components/Options";
import { Methods } from "@/constants/Methods"

const Home = () => {
  console.log(Methods)
  return (
    <div className='flex justify-center items-center h-full w-full'>
      <div className='w-[86%] h-[86%] bg-slate-500 rounded-2xl flex'>
        <div className='w-[30%] bg-slate-600 rounded-l-2xl flex flex-col items-center py-8 overflow-scroll'>
          {Methods.map((item, index) => <Options key={index} item={item} />)}
        </div>
        <TextInput />
      </div>
    </div>
  );
};

export default Home;