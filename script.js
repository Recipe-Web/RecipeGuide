// Fetch the recipes from the JSON file 
async function loadRecipes() {
    const response = await fetch('recipes.json');
    const recipes = await response.json();
    return recipes;
}

// Get selected ingredients
function getSelectedIngredients() {
    const selectedIngredients = [];
    for (let i = 1; i <= 10; i++) {
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
            recipeDiv.classList.add('recipe-card');
            recipeDiv.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.name}" />
                <div class="recipe-card-content">
                    <h3>${recipe.name}</h3>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                    <button class="show-procedure-btn" data-recipe-name="${recipe.name}" data-recipe-procedure="${recipe.procedure}">Show Procedure</button>
                </div>
            `;
            recipeList.appendChild(recipeDiv);
        });

        // Add event listeners to each "Show Procedure" button
        document.querySelectorAll('.show-procedure-btn').forEach(button => {
            button.addEventListener('click', function() {
                const recipeName = button.getAttribute('data-recipe-name');
                const recipeProcedure = button.getAttribute('data-recipe-procedure');
                openModal(recipeName, recipeProcedure);
            });
        });
    }
}

// Function to open the modal and display the procedure
function openModal(recipeName, recipeProcedure) {
    const modal = document.getElementById('procedure-modal');
    const modalRecipeName = document.getElementById('modal-recipe-name');
    const modalProcedure = document.getElementById('modal-procedure');
    
    modalRecipeName.textContent = recipeName;
    modalProcedure.textContent = recipeProcedure;

    modal.style.display = "flex"; // Show modal
}

// Close the modal when the user clicks on the close button
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('procedure-modal').style.display = "none"; // Hide modal
});

// Close the modal if the user clicks anywhere outside of the modal content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('procedure-modal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Load all recipes when the page loads
window.addEventListener('DOMContentLoaded', async () => {
    const recipes = await loadRecipes();
    displayRecipes(recipes);
});

// Add event listeners for ingredient selection
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterRecipes);
});
