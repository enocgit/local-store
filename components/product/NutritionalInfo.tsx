interface NutritionalInfoProps {
  servingSize: string;
  servingsPerContainer: number;
  nutritionalFacts: {
    calories: number;
    totalFat: number;
    saturatedFat: number;
    transFat: number;
    cholesterol: number;
    sodium: number;
    totalCarbohydrates: number;
    dietaryFiber: number;
    sugars: number;
    protein: number;
    vitamins: {
      vitaminD: number;
      calcium: number;
      iron: number;
      potassium: number;
    };
  };
}

export function NutritionalInfo({
  servingSize,
  servingsPerContainer,
  nutritionalFacts,
}: NutritionalInfoProps) {
  return (
    <div className="mx-auto max-w-xl rounded-lg border bg-white p-6">
      <h2 className="mb-4 text-2xl font-bold">Nutrition Facts</h2>

      <div className="border-b-2 border-black pb-2">
        <p className="text-sm">Serving Size {servingSize}</p>
        <p className="text-sm">Servings Per Container {servingsPerContainer}</p>
      </div>

      <div className="border-b-8 border-black py-2">
        <p className="font-bold">Amount Per Serving</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">Calories</span>
          <span className="text-xl">{nutritionalFacts.calories}</span>
        </div>
      </div>

      <div className="border-b border-gray-300 py-2">
        <div className="flex items-center justify-between">
          <span className="font-bold">
            Total Fat {nutritionalFacts.totalFat}g
          </span>
          <span>{Math.round((nutritionalFacts.totalFat * 100) / 65)}%</span>
        </div>
        <div className="pl-4">
          <div className="flex items-center justify-between">
            <span>Saturated Fat {nutritionalFacts.saturatedFat}g</span>
            <span>
              {Math.round((nutritionalFacts.saturatedFat * 100) / 20)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Trans Fat {nutritionalFacts.transFat}g</span>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-300 py-2">
        <div className="flex items-center justify-between">
          <span className="font-bold">
            Cholesterol {nutritionalFacts.cholesterol}mg
          </span>
          <span>{Math.round((nutritionalFacts.cholesterol * 100) / 300)}%</span>
        </div>
      </div>

      <div className="border-b border-gray-300 py-2">
        <div className="flex items-center justify-between">
          <span className="font-bold">Sodium {nutritionalFacts.sodium}mg</span>
          <span>{Math.round((nutritionalFacts.sodium * 100) / 2300)}%</span>
        </div>
      </div>

      <div className="border-b border-gray-300 py-2">
        <div className="flex items-center justify-between">
          <span className="font-bold">
            Total Carbohydrates {nutritionalFacts.totalCarbohydrates}g
          </span>
          <span>
            {Math.round((nutritionalFacts.totalCarbohydrates * 100) / 275)}%
          </span>
        </div>
        <div className="pl-4">
          <div className="flex items-center justify-between">
            <span>Dietary Fiber {nutritionalFacts.dietaryFiber}g</span>
            <span>
              {Math.round((nutritionalFacts.dietaryFiber * 100) / 28)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Sugars {nutritionalFacts.sugars}g</span>
          </div>
        </div>
      </div>

      <div className="border-b-8 border-black py-2">
        <div className="flex items-center justify-between">
          <span className="font-bold">Protein {nutritionalFacts.protein}g</span>
        </div>
      </div>

      <div className="space-y-1 pt-2">
        <div className="flex items-center justify-between">
          <span>Vitamin D {nutritionalFacts.vitamins.vitaminD}mcg</span>
          <span>{nutritionalFacts.vitamins.vitaminD}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Calcium {nutritionalFacts.vitamins.calcium}mg</span>
          <span>{nutritionalFacts.vitamins.calcium}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Iron {nutritionalFacts.vitamins.iron}mg</span>
          <span>{nutritionalFacts.vitamins.iron}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Potassium {nutritionalFacts.vitamins.potassium}mg</span>
          <span>{nutritionalFacts.vitamins.potassium}%</span>
        </div>
      </div>

      <p className="mt-4 text-xs">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of
        food contributes to a daily diet. 2,000 calories a day is used for
        general nutrition advice.
      </p>
    </div>
  );
}
