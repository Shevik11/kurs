if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        var v1 = document.getElementById('v1');
        var resultElement = document.getElementById('result'); // Додано елемент result

        const button = document.getElementById('yourButtonId');
        const seasonNameInput = document.getElementById('season_name_input');
        const seasonYearInput = document.getElementById('season_year_input');

        const deleteButton = document.getElementById('deleteButton');
        const seasonNameInputDelete = document.getElementById('seasonNameInputDelete');
        const seasonYearInputDelete = document.getElementById('seasonYearInputDelete');   

        const updateButton = document.getElementById('updateButton');
        const seasonNameInputUpdate = document.getElementById('seasonNameInputUpdate');
        const seasonYearInputUpdate = document.getElementById('seasonYearInputUpdate');
        const newSeasonNameInputUpdate = document.getElementById('newSeasonNameInputUpdate');
        const newSeasonYearInputUpdate = document.getElementById('newSeasonYearInputUpdate');



        if (v1) {
            v1.addEventListener('click', function () {
              var createXhttp = new XMLHttpRequest();
              createXhttp.open("GET", "http://localhost:8000/season_show", true);
          
              createXhttp.onreadystatechange = function () {
                if (createXhttp.readyState === 4) {
                  if (createXhttp.status === 200) {
                    try {
                      const response = JSON.parse(createXhttp.responseText);
                      resultElement.innerHTML = ""; // Очистіть попередні дані
          
                      // Додайте кожен запис на новому рядку
                      response.forEach(item => {
                        resultElement.innerHTML += JSON.stringify(item) + "<br>";
                      });
                    } catch (error) {
                      console.error('Помилка при обробці відповіді:', error);
                    }
                  } else {
                    console.error('Помилка сервера:', createXhttp.status);
                  }
                }
              };
          
              createXhttp.send();
            });
          }



        
        if (button) {
            button.addEventListener('click', function () {
              const seasonName = seasonNameInput.value;
              const seasonYear = seasonYearInput.value;
            
              // Створення об'єкту з даними для відправки на сервер
              const data = {
                season_name: seasonName,
                season_year: seasonYear
              };
            
              // Створення об'єкту XMLHttpRequest
              const xhr = new XMLHttpRequest();
            
              // Налаштування AJAX-запиту
              xhr.open('POST', '/season_create', true);
              xhr.setRequestHeader('Content-Type', 'application/json');
            
              // Обробка події завершення запиту
              xhr.onload = function() {
                if (xhr.status === 200) {
                  // Обробка успішного відповіді від сервера
                  const response = JSON.parse(xhr.responseText);
                  console.log(response);
                  // Тут ви можете виконати будь-які додаткові дії після успішного створення сезону
                } else {
                  // Обробка помилки
                  console.error('Помилка при виклику /season_create:', xhr.statusText);
                }
              };
            
              // Відправлення AJAX-запиту з даними у форматі JSON
              xhr.send(JSON.stringify(data));
            });}




            deleteButton.addEventListener('click', function () {
              const seasonName = seasonNameInputDelete.value;
              const seasonYear = seasonYearInputDelete.value;
          
              const data = {
                  season_name: seasonName,
                  season_year: seasonYear
              }
          
              const xhr = new XMLHttpRequest();
          
              xhr.open('DELETE', '/season_delete', true);
              xhr.setRequestHeader('Content-Type', 'application/json');
          
              xhr.onload = function () {
                  if (xhr.status === 200) {
                      const response = JSON.parse(xhr.responseText);
                      console.log(response);
                  } else {
                      console.error('Помилка при виклику /season_delete:', xhr.statusText);
                  }
              };
          
              xhr.send(JSON.stringify(data));
          });
          


          if (updateButton) {
            updateButton.addEventListener('click', function () {
                const seasonName = seasonNameInputUpdate.value.trim();
                const seasonYear = seasonYearInputUpdate.value.trim();
                const newSeasonName = newSeasonNameInputUpdate.value.trim();
                const newSeasonYear = newSeasonYearInputUpdate.value.trim();
        
                // Створення об'єкту з даними для відправки на сервер
                const data = {
                    old_season_name: seasonName,
                    old_season_year: seasonYear,
                    new_season_name: newSeasonName,
                    new_season_year: newSeasonYear
                };
        
                // Створення об'єкту XMLHttpRequest
                const xhr = new XMLHttpRequest();
        
                // Налаштування AJAX-запиту
                xhr.open('POST', '/season_update', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
        
                // Обробка події завершення запиту
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        // Обробка успішного відповіді від сервера
                        const response = JSON.parse(xhr.responseText);
                        console.log(response);
                        // Тут ви можете виконати будь-які додаткові дії після успішного оновлення сезону
                    } else {
                        // Обробка помилки
                        console.error('Помилка при виклику /season_update:', xhr.statusText);
                    }
                };
        
                // Відправлення AJAX-запиту з даними у форматі JSON
                xhr.send(JSON.stringify(data));
            });
        }
      })}        