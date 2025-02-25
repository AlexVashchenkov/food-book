document.addEventListener('DOMContentLoaded', function() {
  // Инициализация Swiper
  const swiper = new Swiper('.swiper-container', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  // Загрузка сохраненных блюд
  const savedMeals = JSON.parse(localStorage.getItem('meals') || '[]');

  savedMeals.forEach(meal => {
    const categorySlide = document.querySelector(`[data-category="${meal.category}"]`);
    if (categorySlide) {
      const mealCard = document.createElement('div');
      mealCard.className = 'meal-card';
      mealCard.innerHTML = `
                <img src="${meal.photo}" alt="${meal.title}">
                <p>${meal.title}</p>
            `;
      mealCard.addEventListener('click', () => {
        localStorage.setItem('selectedMeal', JSON.stringify(meal));
        window.location.href = 'meal.html';
      });

      categorySlide.querySelector('.meal-cards-container').appendChild(mealCard);
    }
  });

  // Обновить Swiper после добавления новых элементов
  swiper.update();
});