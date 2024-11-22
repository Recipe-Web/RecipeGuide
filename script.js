// Fetch the recipes from the JSON file
async function loadRecipes() {
    const response = await fetch('recipes.json');
    const recipes = await response.json();
    return recipes;
}

// Get selected ingredients
function getSelectedIngredients() {
    const selectedIngredients = [];
    for (let i = 1; i <= 5; i++) {
        if (document.getElementById(`ingredient${i}`).checked) {
            selectedIngredients.push(document.getElementById(`ingredient${i}`).nextSibling.textContent.trim());
        }
    }
    return selectedIngredients;
}

// Filter recipes based on selected ingredients
async function filterRecipes() {
    const selectedIngredients = getSelectedIngredients();
    const recipes = await loadRecipes();
    const filteredRecipes = recipes.filter(recipe => {
        return selectedIngredients.every(ingredient => recipe.ingredients.includes(ingredient));
    });
    displayRecipes(filteredRecipes);
}

// Display filtered recipes
function displayRecipes(filteredRecipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    if (filteredRecipes.length === 0) {
        recipeList.innerHTML = '<p>No recipes found with the selected ingredients.</p>';
    } else {
        filteredRecipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <h4>${recipe.name}</h4>
                <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
            `;
            recipeList.appendChild(recipeDiv);
        });
    }
}

// Add event listeners for ingredient selection
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterRecipes);
});
