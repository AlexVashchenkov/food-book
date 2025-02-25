document.getElementById('mealForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const reader = new FileReader();
  const file = document.getElementById('photo').files[0];

  reader.onloadend = function() {
    const newMeal = {
      id: Date.now(),
      category: document.getElementById('category').value,
      title: document.getElementById('title').value.trim(),
      ingredients: document.getElementById('ingredients').value.trim().split('\n'),
      steps: document.getElementById('steps').value.trim().split('\n'),
      photo: reader.result
    };

    // Сохраняем в LocalStorage
    const meals = JSON.parse(localStorage.getItem('meals') || '[]');
    meals.push(newMeal);
    localStorage.setItem('meals', JSON.stringify(meals));

    window.location.href = 'meal-map.html';
  }

  if (file) {
    reader.readAsDataURL(file);
  } else {
    alert('Пожалуйста, выберите фото блюда');
  }
});

// Превью изображения
document.getElementById('photo').addEventListener('change', function(e) {
  const preview = document.getElementById('imagePreview');
  preview.innerHTML = '';

  if (this.files && this.files[0]) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(this.files[0]);
    img.style.maxWidth = '200px';
    preview.appendChild(img);
  }
});