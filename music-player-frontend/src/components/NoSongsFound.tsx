import { useNavigate } from "react-router-dom";

const NoSongsFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-white">
      <h2 className="text=2xl font-semibold">No Songs Found</h2>
      <p className="text-gray-400 mt-2">Let's find something for you!</p>
      <button onClick={() => {navigate("/")}} className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200">
        Go to Home
      </button>
    </div>
  );
};

export default NoSongsFound;
