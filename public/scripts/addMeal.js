document.addEventListener('DOMContentLoaded', function () {
  const addMealForm = document.getElementById('add-meal-form');

  addMealForm.addEventListener('submit', function (event) {
    event.preventDefault();

    let mealTime = 'breakfast';
    const newMealTime = document.getElementById('meal-time').value;
    if (newMealTime) {
      mealTime = newMealTime
    }

    const mealName = document.getElementById('meal-name').value;

    const newMealCard = document.createElement('div');
    newMealCard.classList.add('meal-card');

    const mealTitle = document.createElement('p');
    mealTitle.textContent = mealName;

    newMealCard.appendChild(mealTitle);

    const mealCategorySection = document.querySelector(`.swiper-slide[data-category="${mealTime}"] .meal-cards-container`);
    if (mealCategorySection) {
      mealCategorySection.appendChild(newMealCard);
    } else {
      alert('Раздел для данного времени приема пищи не найден.');
    }

    addMealForm.reset();
  });

  function addStep() {
    const stepsList = document.getElementById('steps-list');
    const newStep = document.createElement('div');
    newStep.classList.add('step');
    newStep.innerHTML = `
      <textarea name="step[]" placeholder="Введите этап рецепта" required></textarea>
      <button type="button" class="remove-step" onclick="removeStep(this)">×</button>
    `;
    stepsList.appendChild(newStep);
  }

  function removeStep(button) {
    button.parentElement.remove();
  }

  window.addIngredient = addIngredient;
  window.removeIngredient = removeIngredient;
  window.addStep = addStep;
  window.removeStep = removeStep;
});