export default function DeerRecipesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Deer Recipes</h1>

        {/* Recipe 1: Venison Chili */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Venison Chili</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Ingredients:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>3 tablespoons unsalted butter</li>
              <li>1 small red onion, chopped</li>
              <li>4 cloves garlic, minced</li>
              <li>¼ cup dark brown sugar</li>
              <li>3 cups red wine (Port works well)</li>
              <li>¼ cup red wine vinegar</li>
              <li>¼ cup tomato paste</li>
              <li>4 cups low-sodium chicken broth</li>
              <li>1 teaspoon ground cumin</li>
              <li>½ teaspoon cayenne pepper</li>
              <li>½ teaspoon chili powder</li>
              <li>2 tablespoons chopped fresh cilantro</li>
              <li>Salt to taste</li>
              <li>9 slices bacon, diced</li>
              <li>2 pounds venison, diced</li>
              <li>2 cups black beans, cooked and drained</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Melt butter in large pot over medium heat. Stir in the onion and garlic and sauté for 3 to 4 minutes. Stir in brown sugar and cook 2 to 3 minutes.</li>
              <li>Add wine, vinegar, tomato paste, chicken stock, cumin, cayenne pepper, chili powder, cilantro and salt. Simmer 30-35 minutes or until reduced by about half.</li>
              <li>Meanwhile, cook bacon in a large skillet over medium-high heat until browned. Move bacon to one side of the pan and add venison to the other. Season with salt to taste.</li>
              <li>Sauté 15 minutes or until browned. Stir in beans and toss all together. Transfer to simmering pot.</li>
              <li>Mix and let simmer for about an hour.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
