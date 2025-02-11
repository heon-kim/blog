import { CATEGORIES } from "../data/categories";

function Sidebar({ 
  allTags, 
  selectedTags, 
  selectedCategory, 
  selectedSubcategory, 
  onTagToggle, 
  onCategoryToggle, 
  onSubcategoryToggle 
}) {
  return (
    <div className="hidden lg:block border-l p-4">
      <div className="sticky top-8">
        {/* 카테고리 목록 */}
        <div className="mb-6">
          <h2 className="text-sm text-gray-500 mb-2">카테고리</h2>
          <div className="space-y-2">
            {Object.entries(CATEGORIES).map(([key, category]) => (
              <div key={key}>
                <button
                  onClick={() => onCategoryToggle(key)}
                  className={`text-sm font-medium ${
                    selectedCategory === key
                      ? 'text-orange-600'
                      : 'text-gray-900 hover:text-orange-600'
                  }`}
                >
                  {category.name}
                  {selectedCategory === key && (
                    <span className="ml-1 font-medium">×</span>
                  )}
                </button>
                {selectedCategory === key && (
                  <div className="ml-4 mt-1 space-y-1">
                    {Object.entries(category.subcategories).map(([subKey, subCategory]) => (
                      <button
                        key={subKey}
                        onClick={() => onSubcategoryToggle(subKey)}
                        className={`block text-sm ${
                          selectedSubcategory === subKey
                            ? 'text-orange-600'
                            : 'text-gray-600 hover:text-orange-600'
                        }`}
                      >
                        {subCategory.name}
                        {selectedSubcategory === subKey && (
                          <span className="ml-1 font-medium">×</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 태그 목록 */}
        <div>
          <h2 className="text-sm text-gray-500 mb-4">태그</h2>
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
    </div>
  );
}

export default Sidebar; 