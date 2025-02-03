const EditLinks = ({ isOpen, onClose, links, setLinks }) => {
  if (!isOpen) return null;

  const addNewLink = () => {
    setLinks([...links, ""]);
  };

  const updateLink = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const removeLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-500">Edit Links</h3>
        </div>
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={index} className="relative">
              <input
                type="text"
                value={link}
                onChange={(e) => updateLink(index, e.target.value)}
                placeholder={`Link${index + 1}`}
                className="w-full p-2 pr-8 border rounded"
              />
              <button
                onClick={() => removeLink(index)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addNewLink}
          className="mt-4 text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          ADD ANOTHER LINK
        </button>
        <div className="flex justify-center items-center mt-5">
          <button
            className="bg-[#4285F4] text-white px-6 py-2 rounded-lg"
            onClick={onClose}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLinks;
