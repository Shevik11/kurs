if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        var ShowListOfTeams = document.getElementById('ShowListOfTeams');
        var resultElement = document.getElementById('result');
        var TeamsFromSeason = document.getElementById('TeamsFromSeason');
        var season_name_input = document.getElementById('season_name_input');
        var resultElement2 = document.getElementById('result2');
        var AddTeam = document.getElementById('AddTeam');
        var team_name_input = document.getElementById('team_name_input');
        var team_season_input = document.getElementById('team_season_input');
        var team_name_for_update_input = document.getElementById('team_name_for_update_input');
        var team_season_for_update_input = document.getElementById('team_season_for_update_input');
        var what_user_want_to_change = document.getElementById('what_user_want_to_change');
        var new_value_input = document.getElementById('new_value_input');
        var ChangeTeamData = document.getElementById('ChangeTeamData');
        var DeleteTeamInSeasonButton = document.getElementById('DeleteTeamInSeasonButton');
        var team_name_to_delete_in_season = document.getElementById('team_name_to_delete_in_season');
        var season_name_to_delete_team_in = document.getElementById('season_name_to_delete_team_in');
        var DeleteTeamButton = document.getElementById('DeleteTeamButton');
        var team_name_to_delete = document.getElementById('team_name_to_delete');




        if (DeleteTeamButton) {
            DeleteTeamButton.addEventListener('click', function () {
                var team_name = team_name_to_delete.value;
                var data = {
                    team_name: team_name
                }
                var createXhttpRequest = new XMLHttpRequest();
                createXhttpRequest.open("DELETE", `http://localhost:8000/team_delete`, true);
                createXhttpRequest.setRequestHeader('Content-Type', 'application/json');
                createXhttpRequest.onreadystatechange = function () {
                    if (createXhttpRequest.readyState === 4) {
                        if (createXhttpRequest.status === 200) {
                            try {
                                const response = JSON.parse(createXhttpRequest.responseText);
                                console.log(response);
                            } catch (error) {
                                console.error('Помилка при обробці відповіді:', error);
                            }
                        } else {
                            console.error('Помилка сервера:', createXhttpRequest.status);
                        }
                    }
                };
                createXhttpRequest.send(JSON.stringify(data));
            });
        }


        if (DeleteTeamInSeasonButton) {
            DeleteTeamInSeasonButton.addEventListener('click', function () {
                var team_name = team_name_to_delete_in_season.value;
                var season_name = season_name_to_delete_team_in.value;
                var data = {
                    team_name: team_name,
                    season_name: season_name
                }
                var createXhttpRequest = new XMLHttpRequest();
                createXhttpRequest.open("DELETE", `http://localhost:8000/teams_delete_in_season`, true);
                createXhttpRequest.setRequestHeader('Content-Type', 'application/json');
                createXhttpRequest.onreadystatechange = function () {
                    if (createXhttpRequest.readyState === 4) {
                        if (createXhttpRequest.status === 200) {
                            try {
                                const response = JSON.parse(createXhttpRequest.responseText);
                                console.log(response);
                            } catch (error) {
                                console.error('Помилка при обробці відповіді:', error);
                            }
                        } else {
                            console.error('Помилка сервера:', createXhttpRequest.status);
                        }
                    }
                };
                createXhttpRequest.send(JSON.stringify(data));
            });
        }


        if (ShowListOfTeams) {
            ShowListOfTeams.addEventListener('click', function () {
                var createXhttp = new XMLHttpRequest();
                createXhttp.open("GET", "http://localhost:8000/teams_show", true);
        
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
        
        if (ChangeTeamData) {
            ChangeTeamData.addEventListener('click', function () {
                var team_name_for_update_ = team_name_for_update_input.value;
                var team_season_for_update = team_season_for_update_input.value;
                var what_user_want = what_user_want_to_change.value;
                var new_value = new_value_input.value;
        
                // Перевірка чи отримані значення передаються правильно
                console.log(team_name_for_update_);
                console.log(team_season_for_update);
                console.log(what_user_want);
                console.log(new_value);
        
                const data = {
                    team_name_for_update_: team_name_for_update_,
                    team_season_for_update: team_season_for_update,
                    what_user_want: what_user_want,
                    new_value: new_value
                }
        
                var createXhttpRequest = new XMLHttpRequest();
                createXhttpRequest.open("PUT", `http://localhost:8000/teams_change_data`, true);
                createXhttpRequest.setRequestHeader('Content-Type', 'application/json');
                createXhttpRequest.onreadystatechange = function () {
                    if (createXhttpRequest.readyState === 4) {
                        if (createXhttpRequest.status === 200) {
                            try {
                                const response = JSON.parse(createXhttpRequest.responseText);
                                console.log(response);
                            } catch (error) {
                                console.error('Помилка при обробці відповіді:', error);
                            }
                        } else {
                            console.error('Помилка сервера:', createXhttpRequest.status);
                        }
                    }
                };
                createXhttpRequest.send(JSON.stringify(data));
            });
        }
        


        if (TeamsFromSeason && resultElement2) {
            TeamsFromSeason.addEventListener('click', function () {
                const season_name = season_name_input.value;
                var createXhttpRequest = new XMLHttpRequest();
                createXhttpRequest.open("GET", `http://localhost:8000/teams_show_from_season?season_name=${season_name}`, true);
                createXhttpRequest.onreadystatechange = function () {
                    if (createXhttpRequest.readyState === 4) {
                        if (createXhttpRequest.status === 200) {
                            try {
                                const responseText = createXhttpRequest.responseText.trim();
                                if (responseText) {
                                    const response = JSON.parse(responseText);
                                    resultElement2.innerHTML = ""; // Очистіть попередні дані

                                    console.log('Отримана відповідь від сервера:', responseText);

                                    // Додайте кожен запис на новому рядку
                                    response.forEach(item => {
                                        resultElement2.innerHTML += item.team_name + '<br>';                                    
                                    });
                                } else {
                                    console.error('Отримано порожню відповідь від сервера.');
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
        if (AddTeam) {
            AddTeam.addEventListener('click', function () {
                const team_name = team_name_input.value;
                const team_season = team_season_input.value;
                const data = {
                    team_name: team_name,
                    team_season: team_season
                }
                var createXhttpRequest = new XMLHttpRequest();
                createXhttpRequest.open("POST", `http://localhost:8000/teams_add`, true);
                createXhttpRequest.setRequestHeader('Content-Type', 'application/json');
                createXhttpRequest.onreadystatechange = function () {
                    if (createXhttpRequest.readyState === 4) {
                        if (createXhttpRequest.status === 200) {
                            try {
                                const response = JSON.parse(createXhttpRequest.responseText);
                                console.log(response);
                            } catch (error) {
                                console.error('Помилка при обробці відповіді:', error);
                            }
                        } else {
                            console.error('Помилка сервера:', createXhttpRequest.status);
                        }
                    }
                };
                createXhttpRequest.send(JSON.stringify(data));
            });
        }




    })}