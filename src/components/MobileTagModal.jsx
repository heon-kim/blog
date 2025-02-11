function MobileTagModal({ 
  showMobileTags, 
  onClose, 
  allTags, 
  selectedTags, 
  onTagToggle 
}) {
  if (!showMobileTags) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">태그 선택</h2>
          <button 
            onClick={onClose}
            className="text-gray-500"
          >
            닫기
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`px-2 py-1 text-sm rounded-xl transition-colors ${
                selectedTags.has(tag)
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MobileTagModal; 