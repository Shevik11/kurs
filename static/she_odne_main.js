if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        var vuvode = document.getElementById('vuvode');
        var season_to_show = document.getElementById('season_to_show');
        var resultElement = document.getElementById('result');
        var vuvode2 = document.getElementById('vuvode2');
        var season_to_show2 = document.getElementById('season_to_show2');
        var resultElement2 = document.getElementById('result2');

        if (vuvode2) {
            vuvode2.addEventListener('click', function () {
                // Забороняємо стандартну поведінку кнопки (оновлення сторінки)
                event.preventDefault();
        
                const seasonName = season_to_show2.value;
        
                var createXhttpRequest = new XMLHttpRequest();
                createXhttpRequest.open('GET', `http://localhost:8000/calendar?season=${seasonName}`, true);
        
                createXhttpRequest.onreadystatechange = function () {
                    if (createXhttpRequest.readyState === 4) {
                        if (createXhttpRequest.status === 200) {
                            try {
                                const response = JSON.parse(createXhttpRequest.responseText);
                                resultElement2.innerHTML = "";
        
                                // Перевірка, чи response є масивом
                                if (Array.isArray(response.result)) {
                                    // Створення таблиці
                                    const table = document.createElement('table');
                                    table.classList.add('calendar-table');
        
                                    // Створення заголовка таблиці
                                    const headerRow = table.createTHead().insertRow();
                                    const tourHeader = document.createElement('th');
                                    tourHeader.textContent = 'Тур';
                                    headerRow.appendChild(tourHeader);
        
                                    const matchesHeader = document.createElement('th');
                                    matchesHeader.textContent = 'Матчі';
                                    headerRow.appendChild(matchesHeader);
        
                                    // Додавання даних у таблицю
                                    response.result.forEach(tour => {
                                        const row = table.insertRow();
        
                                        const tourNumberCell = row.insertCell();
                                        tourNumberCell.textContent = tour.tourNumber;
        
                                        const matchesCell = row.insertCell();
                                        matchesCell.textContent = tour.matches.join(', ');
                                    });
        
                                    // Додавання таблиці на сторінку
                                    resultElement2.appendChild(table);
                                } else {
                                    // Якщо результат не є масивом, вивести об'єкт у вигляді <pre> елементу
                                    const preElement = document.createElement('pre');
                                    preElement.textContent = JSON.stringify(response, null, 2);
                                    resultElement2.appendChild(preElement);
                                }
                            } catch (error) {
                                console.error('Помилка при обробці відповіді:', error);
                            }
                        } else {
                            console.error('Помилка сервера:', createXhttpRequest.status);
                        }
                    }
                };
        
                createXhttpRequest.send();
            });
        }
        
        if (vuvode) {
            vuvode.addEventListener('click', function (event) {
                // Забороняємо стандартну поведінку кнопки (оновлення сторінки)
                event.preventDefault();
        
                const seasonName = season_to_show.value;
        
                var createXhttpRequest = new XMLHttpRequest();
                createXhttpRequest.open('GET', `http://localhost:8000/see_season?season=${seasonName}`, true);
        
                createXhttpRequest.onreadystatechange = function () {
                    if (createXhttpRequest.readyState === 4) {
                        if (createXhttpRequest.status === 200) {
                            try {
                                const response = JSON.parse(createXhttpRequest.responseText);
                                resultElement.innerHTML = "";
        
                                // Перевірка, чи response є масивом
                                if (Array.isArray(response.result)) {
                                    // Створення таблиці
                                    const table = document.createElement('table');
        
                                    // Створення заголовка таблиці
                                    const headerRow = document.createElement('tr');
                                    Object.keys(response.result[0]).forEach(key => {
                                        const th = document.createElement('th');
                                        th.textContent = key;
                                        headerRow.appendChild(th);
                                    });
                                    table.appendChild(headerRow);
        
                                    // Додавання рядків у таблицю
                                    response.result.forEach(item => {
                                        const row = document.createElement('tr');
                                        Object.values(item).forEach(value => {
                                            const td = document.createElement('td');
                                            td.textContent = value;
                                            row.appendChild(td);
                                        });
                                        table.appendChild(row);
                                    });
        
                                    // Додавання таблиці до результату
                                    resultElement.appendChild(table);
                                } else {
                                    // Якщо response не є масивом, створюємо простий <p> елемент
                                    const paragraph = document.createElement('p');
                                    paragraph.textContent = JSON.stringify(response);
                                    resultElement.appendChild(paragraph);
                                }
                            } catch (error) {
                                console.error('Помилка при обробці відповіді:', error);
                            }
                        } else {
                            console.error('Помилка сервера:', createXhttpRequest.status);
                        }
                    }
                };
        
                createXhttpRequest.send();
            });
        }
        
    });
}
