// app/resources/recipes/page.tsx
"use client";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import OurPartners from "@/components/ourPartners";
import LatestNews from "@/components/NewsEvent";
import Link from "next/link";

export default function RecipesPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Banner Section */}
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[#E7DCCF] px-4 pb-12 pt-24 sm:min-h-[320px] sm:px-6 sm:pb-14 sm:pt-28 md:min-h-[360px]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#241304] mb-4">Wild Game Recipes</h1>
            <nav className="text-sm text-[#281703]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E4803A]">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/resources" className="hover:text-[#E4803A]">Resources</Link>
              <span className="mx-2">›</span>
              <span>Recipes</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">

          {/* Pheasant Recipes Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#241304] mb-8">Pheasant Recipes</h2>

            {/* Recipe 1: Breast of Pheasant with Fresh Sage */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h3 className="text-2xl font-semibold text-[#E4803A] mb-4">Breast of Pheasant with Fresh Sage</h3>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#E4803A] mb-2">Ingredients:</h4>
                <ul className="list-disc list-inside text-[#31261d] space-y-1">
                  <li>4 pheasant breast, boned</li>
                  <li>2 cups flour</li>
                  <li>Salt/Pepper to taste</li>
                  <li>1/4 cup butter</li>
                  <li>10 fresh sage leaves</li>
                  <li>2 tablespoons tomato paste</li>
                  <li>2 tablespoons brandy</li>
                  <li>1 cup whipping cream</li>
                  <li>Serve this with good Sauvignon Blanc</li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#E4803A] mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside text-[#31261d] space-y-2">
                  <li>Preheat oven to 200 degrees and warm an oven-proof platter. Rinse the pheasant and pat dry. Coat with mixture of flour, salt, and pepper.</li>
                  <li>Heat a large heavy skillet and melt butter. Cook the pheasants on both sides until cooked through, taking care not to overbrown. Remove to the platter, cover with foil and keep warm in oven.</li>
                  <li>Increase the heat under the skillet and add the sage leaves and tomato paste. Add the brandy, stirring to deglaze. Add the cream and stir briskly to mix well. Cook until the sauce is reduced to desired consistency. Taste and adjust the seasonings. Pour over the pheasants. Serve.</li>
                </ol>
              </div>
            </div>

            {/* Recipe 2: Brandied Tarragon Pheasant */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h3 className="text-2xl font-semibold text-[#E4803A] mb-4">Brandied Tarragon Pheasant</h3>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#E4803A] mb-2">Ingredients:</h4>
                <ul className="list-disc list-inside text-[#31261d] space-y-1">
                  <li>2 tablespoons butter</li>
                  <li>2 tablespoons extra-virgin olive oil</li>
                  <li>2 pheasants, cut into pieces (pound breasts to even thickness)</li>
                  <li>Salt and freshly ground pepper</li>
                  <li>1/2 cup all-purpose flour</li>
                  <li>2 large shallots, thinly sliced</li>
                  <li>1/4 cup applejack brandy</li>
                  <li>6 large white mushrooms, thinly sliced</li>
                  <li>1/4 cup dry white wine</li>
                  <li>1/2 cup heavy cream</li>
                  <li>2 tablespoons chopped fresh tarragon leaves</li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#E4803A] mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside text-[#31261d] space-y-2">
                  <li>While the rice cooks, heat 2 tablespoons extra-virgin olive oil in a large skillet over medium high heat. Season the pheasant with salt and pepper and dredge lightly in flour and shake off any excess.</li>
                  <li>Brown pheasant 3 to 4 minutes on each side. Remove pheasant and reduce heat a little and melt in 2 tablespoons butter.</li>
                  <li>Saute the shallots 3 minutes until soft but not browned. Remove pan from the heat, add the brandy and ignite with a long kitchen match until the flame subsides.</li>
                  <li>Return pan to the heat, add mushrooms and cook 2 to 3 minutes. Season with salt and pepper. Add wine and reduce 1 to 2 minutes.</li>
                  <li>Stir in cream and tarragon and slide pheasant back into the pan. Reduce heat to low and simmer 8 to 10 minutes.</li>
                </ol>
              </div>
            </div>

            {/* Recipe 3: Pheasant Apple Casserole */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h3 className="text-2xl font-semibold text-[#E4803A] mb-4">Pheasant Apple Casserole</h3>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#E4803A] mb-2">Ingredients:</h4>
                <ul className="list-disc list-inside text-[#31261d] space-y-1">
                  <li>1 pheasant, cut into pieces</li>
                  <li>Seasoned flour</li>
                  <li>4 tablespoons butter</li>
                  <li>½ teaspoon salt</li>
                  <li>½ teaspoon thyme</li>
                  <li>1/8 teaspoon black pepper</li>
                  <li>2 large peeled and sliced apples (Granny Smith or other baking apple)</li>
                  <li>1 cup apple cider</li>
                  <li>2 tablespoons wine vinegar</li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#E4803A] mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside text-[#31261d] space-y-2">
                  <li>Roll pheasant pieces in seasoned flour and brown in butter over medium heat.</li>
                  <li>Lay pheasant pieces in a single layer in a casserole dish and sprinkle with salt, thyme and pepper.</li>
                  <li>Add apple slices and pour cider and vinegar over all.</li>
                  <li>Bake covered at 350 degrees for 1 hour 15 minutes.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Deer Recipes Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#241304] mb-8">Deer Recipes</h2>

            {/* Recipe 1: Venison Chili */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h3 className="text-2xl font-semibold text-[#E4803A] mb-4">Venison Chili</h3>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#E4803A] mb-2">Ingredients:</h4>
                <ul className="list-disc list-inside text-[#31261d] space-y-1">
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
                <h4 className="text-lg font-semibold text-[#E4803A] mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside text-[#31261d] space-y-2">
                  <li>Melt butter in large pot over medium heat. Stir in the onion and garlic and sauté for 3 to 4 minutes. Stir in brown sugar and cook 2 to 3 minutes.</li>
                  <li>Add wine, vinegar, tomato paste, chicken stock, cumin, cayenne pepper, chili powder, cilantro and salt. Simmer 30-35 minutes or until reduced by about half.</li>
                  <li>Meanwhile, cook bacon in a large skillet over medium-high heat until browned. Move bacon to one side of the pan and add venison to the other. Season with salt to taste.</li>
                  <li>Sauté 15 minutes or until browned. Stir in beans and toss all together. Transfer to simmering pot.</li>
                  <li>Mix and let simmer for about an hour.</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      </main>
      <OurPartners />
      <LatestNews />
      <Footer />
    </>
  );
}