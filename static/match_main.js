if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        var matchButton = document.getElementById('Match');
        var seasonMatch = document.getElementById('season_match');
        var team1Match = document.getElementById('team1_match');
        var team2Match = document.getElementById('team2_match');
        var score1Match = document.getElementById('score1_match');
        var score2Match = document.getElementById('score2_match');
        var dateMatch = document.getElementById('date_match');

        if (matchButton) {
            matchButton.addEventListener('click', function () {
                const seasonMatchValue = seasonMatch.value;
                const team1MatchValue = team1Match.value;
                const team2MatchValue = team2Match.value;
                const score1MatchValue = score1Match.value;
                const score2MatchValue = score2Match.value;
                const dateMatchValue = dateMatch.value;

                const data = {
                    season_name: seasonMatchValue,
                    home_team_name: team1MatchValue,
                    away_team_name: team2MatchValue,
                    goals_scored_home: score1MatchValue,
                    goals_scored_away: score2MatchValue,
                    match_date: dateMatchValue
                };

                const xhr = new XMLHttpRequest();

                xhr.open('POST', 'http://localhost:8000/play_match', true);
                xhr.setRequestHeader('Content-Type', 'application/json');

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        console.log(response);
                    } else {
                        console.error('Помилка сервера:', xhr.status);
                    }
                }
                xhr.send(JSON.stringify(data));
            });
        }
    });
}
