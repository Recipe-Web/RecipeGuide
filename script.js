document.getElementById("hamburger").addEventListener("click", function() {
    const navLinks = document.querySelector(".nav-links");
    navLinks.classList.toggle("active");
});

// Fetch the recipes from the JSON file 
async function loadRecipes() {
    const response = await fetch('recipes.json');
    const recipes = await response.json();
    return recipes;
}

// Get selected ingredients
function getSelectedIngredients() {
    const selectedIngredients = [];
    for (let i = 1; i <= 20; i++) {
        if (document.getElementById(`ingredient${i}`).checked) {
            selectedIngredients.push(document.getElementById(`ingredient${i}`).nextSibling.textContent.trim());
        }
    }
    return selectedIngredients;
}

// Filter recipes based on selected ingredients and search query
async function filterRecipes() {
    const selectedIngredients = getSelectedIngredients();
    const searchQuery = document.getElementById('recipe-search').value.toLowerCase();
    const recipes = await loadRecipes();

    // Filter recipes by ingredients and search query
    const filteredRecipes = recipes.filter(recipe => {
        const matchesIngredients = selectedIngredients.every(ingredient => recipe.ingredients.includes(ingredient));
        const matchesSearch = recipe.name.toLowerCase().includes(searchQuery) || recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchQuery));
        return matchesIngredients && matchesSearch;
    });

    displayRecipes(filteredRecipes);
}

// Display filtered recipes
function displayRecipes(filteredRecipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    if (filteredRecipes.length === 0) {
        recipeList.innerHTML = '<p>No recipes found with the selected ingredients or search query.</p>';
    } else {
        filteredRecipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe-card');
            recipeDiv.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.name}" />
                <div class="recipe-card-content"; style="height:35%">
                    <h3 style="height: 35%">${recipe.name}</h3>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                </div>
                <button class="show-procedure-btn" style="border: none" data-recipe-name="${recipe.name}" data-recipe-procedure="${recipe.procedure}">Show Procedure</button>
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

// Add event listeners for ingredient selection and search input
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterRecipes);
});

document.getElementById('recipe-search').addEventListener('input', filterRecipes);







// Number of cards per page
const cardsPerPage = 4;
let currentPage = 1;

// Get all the cards
const cards = document.querySelectorAll('.cards-checkboxes .card');
const totalPages = Math.ceil(cards.length / cardsPerPage);

// Function to show only the cards for the current page
function showCardsForPage() {
    // Hide all cards
    cards.forEach(card => card.style.display = 'none');

    // Calculate the start and end indices for the current page
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;

    // Show the cards for the current page
    for (let i = start; i < end; i++) {
        if (cards[i]) {
            cards[i].style.display = 'block';
        }
    }

    // Disable/Enable buttons based on the current page
    document.getElementById('prev-button').disabled = currentPage === 1;
    document.getElementById('next-button').disabled = currentPage === totalPages;
}

// Function to change the page when the user clicks next or back
function changePage(direction) {
    currentPage += direction;

    // Ensure we stay within bounds
    if (currentPage < 1) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    showCardsForPage();
}

// Initialize the page by showing the cards for the first page
showCardsForPage();
