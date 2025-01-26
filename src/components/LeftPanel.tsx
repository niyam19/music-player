
const LeftPanel = () => {
  return (
    <div className="w-64 bg-gray-900 h-screen text-white p-4 flex-shrink-0">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Browse</h2>
        <ul className="space-y-2">
            {/* <li className="hover:text-gray-400 cursor-pointer">New Releases</li>
            <li className="hover:text-gray-400 cursor-pointer">Top Charts</li>
            <li className="hover:text-gray-400 cursor-pointer">Podcasts</li> */}
            <li>Coming Soon...</li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Library</h2>
        <ul className="space-y-2">
            <li className="hover:text-gray-400 cursor-pointer">History</li>
            <li className="hover:text-gray-400 cursor-pointer">Liked Songs</li>
        </ul>
      </div>
    </div>
    
  );
};

export default LeftPanel;
