
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    var SeasonButton = document.getElementById('SeasonButton');
    var MatchesButton = document.getElementById('MatchesButton');
    var TeamsButton = document.getElementById('TeamsButton');
    var Shoto = document.getElementById('Shoto');
  

    if (SeasonButton) {
      SeasonButton.addEventListener('click', function () {
        window.location.href = 'http://localhost:8000/season_page/';
      });
    }
    
    
    if (TeamsButton) {
      TeamsButton.addEventListener('click', function () {
        window.location.href = 'http://localhost:8000/teams/';
      });
    }
  
    if (MatchesButton) {
      MatchesButton.addEventListener('click', function () {
        window.location.href = 'http://localhost:8000/matches/';
      });
    }

    if (Shoto) {
      Shoto.addEventListener('click', function () {
        window.location.href = 'http://localhost:8000/shoto/';
      });
    }

  });
}



