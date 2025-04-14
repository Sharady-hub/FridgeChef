let ingredients = '';
let dietaryRestrictions = '';

function updateIngredients(value) {
  ingredients = value;
}

function updateDietary(value) {
  dietaryRestrictions = value;
}

async function generateRecipe() {
  const recipeOutput = document.getElementById('recipeOutput');
  recipeOutput.classList.add('hidden');

  if (!ingredients) {
    alert('Please enter some ingredients!');
    return;
  }

  try {
    const response = await fetch('https://api.google-generative.ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${'AIzaSyC6adU1mN8HsKCVHF_ivAJDejUfPZFCtmE'}` // Replace with secure method in production
      },
      body: JSON.stringify({
        model: 'gemini-2.0-flash',
        prompt: `You are a professional chef. Given the following ingredients, generate a recipe. If dietary restrictions are specified, take them into account.\nIngredients: ${ingredients}\nDietary Restrictions: ${dietaryRestrictions}\nRecipe Name:\nIngredients:\nInstructions:`
      })
    });

    const data = await response.json();
    const output = data.candidates[0].content;
    const [recipeName, ingredientsList, instructions] = output.split('\n').filter(Boolean);

    document.getElementById('recipeOutput').querySelector('h2').textContent = recipeName.replace('Recipe Name:', '').trim();
    document.getElementById('recipeIngredients').innerHTML = ingredientsList.replace('Ingredients:', '').trim().split(',').map(item => `<li>${item.trim()}</li>`).join('');
    document.getElementById('recipeInstructions').value = instructions.replace('Instructions:', '').trim();

    recipeOutput.classList.remove('hidden');
  } catch (error) {
    console.error('Error generating recipe:', error);
    alert('Something went wrong! Check console for details.');
  }
}