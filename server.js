import  express from 'express';
import paypal from 'paypal-rest-sdk'; // PayPal REST SDK for Node.js 
import cors from 'cors'; // CORS (Cross-Origin Resource Sharing) middleware
import multer from 'multer';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url'; // Function to convert file URLs to paths
import { dirname} from 'path'; // Function to get the directory name from a path
import path from 'path'; // Core module for working with file and directory paths

// Modules
import SeasonActions from './static/static2/season_actions.js';
import  teams_action from "./static/static2/teams.js";
import  Matches  from "./static/static2/matches.js";
import  tables  from './static/static2/tables.js';


const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); // 


const db_a = new SeasonActions();
const ta = new teams_action();
const match = new Matches();
const table = new tables()

const app = express();

// allow all origins
app.use(cors({
  origin: '*'
}));

app.use(multer().none()); 
app.use(express.json()); 
app.use(express.static('static', { index: false }));
app.use(bodyParser.raw({ type: 'text/plain' }));

const port = 8000;

paypal.configure({
  'mode': 'sandbox',
  'client_id': 'ATSccmKUYlTrgYBftuEbwsCaJgzNlXU7s1rrmU5WTbTyE_wGIv3MpecF_qdT5CPEcHyr0yFrtneH1iEq',
  'client_secret': 'EA-9AJj0Pzq67kPeTWy-NM0FCpFzdWkDTfIDcvtEku0qupujR-cEKuco1LQR9Ue6ui9fRRnTuRIUoSMW'
});



app.post('/pay', (req, res) => {
  const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:8000/success",
          "cancel_url": "http://localhost:8000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Premium",
                  "sku": "001",
                  "price": "5.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "5.00"
          },
          "description": "Premium function"
      }]
  };


  app.get('/success', (req, res) => {
      const payerId = req.query.PayerID;
      const paymentId = req.query.paymentId;
      
      const execute_payment_json = {
          "payer_id": payerId,
          "transactions": [{
              "amount": {
                  "currency": "USD",
                  "total": "5.00"
              }
          }]
      };
      
      paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
          console.log(error.response); // payment execution fails
          throw error;
        } else {
          // console.log(JSON.stringify(payment));
          // Redirect to '/yes' if successful
          res.redirect('/yes');
        }
      });
    });
  
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) { // loop with linkd
          if (payment.links[i].rel === 'approval_url') { // confirm link
            res.redirect(payment.links[i].href); // Redirect to PayPal
          }
        }
      }
    });
  
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/paypal.html'));
});


app.get('/cancel', (req, res) => res.send('Cancelled'));
  
app.get('/yes', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
  });
  

app.get('/season_page', (req, res) => {
    res.sendFile(__dirname + '/static/season.html');
  });
  

app.post('/season_create', async (req, res) => {
    const season_name = req.body.season_name;
    const season_year = req.body.season_year;
    const result = await db_a.insertData(season_name, season_year);
    res.json(result);
  });

app.post('/season_update', async (req, res) => {
    const { old_season_name, old_season_year, new_season_name, new_season_year } = req.body;
    const result = await db_a.updateData(old_season_name, old_season_year, new_season_name, new_season_year);
    res.json(result);
  });

app.delete('/season_delete', async(req, res) => {
    const season_name = req.body.season_name;
    const season_year = req.body.season_year;
    const result = await db_a.deleteData(season_name, season_year);
    res.json(result);
  });

app.get('/season_show', async (req, res) => {
    const result = await db_a.query('SELECT * FROM season');
    res.json(result);});

app.get('/teams', (req, res) => {
  res.sendFile(__dirname + '/static/teams.html');
  });
  
  app.get('/teams_show', async (req, res) => {
    try {
        const result = await ta.AllTeamsAndSeasons();
        // console.log('Result:', result); // Додайте лог
        res.json(result);
    } catch (error) {
        console.error('Error in AllTeamsAndSeasons():', error); // Додайте лог
        res.status(500).json({ error: 'Помилка на сервері' });
    }
});


app.get('/teams_show_from_season', async (req, res) => {
  const season_name = req.query.season_name;
  const result = await ta.GetTeamsFromSeason(season_name);
  res.json(result);
});

app.post('/teams_add', async (req, res) => {
  try {
      const season_name = req.body.team_season; // Зміни тут, бо ви використовуєте team_season в запиті
      const team_name = req.body.team_name;
      const result = await ta.addTeam(team_name, season_name);
      res.json(result);
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/teams_change_data', async (req, res) => {
      // Отримання даних з тіла запиту
      const team_name_for_update = req.body.team_name_for_update_;
      const team_season_for_update = req.body.team_season_for_update;
      const what_user_want = req.body.what_user_want;
      const new_value = req.body.new_value;

      // Обробка даних і виклик відповідної функції
      const result = await ta.changeTeamInfo(team_season_for_update, team_name_for_update, what_user_want, new_value);

      // Відправлення відповіді клієнту
      res.json(result);
  });

app.delete('/teams_delete_in_season', async (req, res) => {
  const team_name = req.body.team_name;
  const season_name = req.body.season_name;
  const result = await ta.deleteTeamInSeason(team_name, season_name);
  res.json(result);
});

app.delete('/team_delete', async (req, res) => {
  const team_name = req.body.team_name;
  const result = await ta.deleteTeam(team_name);
  res.json(result);
})


  app.get('/matches', (req, res) => {
  res.sendFile(__dirname + '/static/matches.html');
  });

  app.post('/play_match', (req, res) => {
    const season_name = req.body.season_name;
    const homeTeamName = req.body.home_team_name;
    const awayTeamName = req.body.away_team_name;
    const goalsScoredHome = req.body.goals_scored_home;
    const goalsScoredAway = req.body.goals_scored_away;
    const matchDate = req.body.match_date;
    match.playMatchAndSaveData(season_name, homeTeamName, awayTeamName, goalsScoredHome, goalsScoredAway, matchDate);
    res.json({ success: true });
  });
  
app.get('/shoto', (req, res) => {
  res.sendFile(__dirname + '/static/she_odna_html.html');
});

app.get('/see_season', async (req, res) => {
  const season_name = req.query.season;
  const { result, columnWidths } = await table.showTablesOfSeason(season_name);
  res.json({ result, columnWidths });
});

app.get('/calendar', async (req, res) => {
  const season_name = req.query.season;
  const calendar = await table.generateCalendarForSeason(season_name);
  res.json(calendar);
});


  app.listen(port, () => {
    console.log(`Сервер на порту ${port}`);
  });
    