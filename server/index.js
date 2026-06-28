const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


//check to see if database properly connects to express server before writing other routes
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Connected to Postgres!', time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});



//route to fetch all applications
app.get('/api/applications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM applications ORDER BY id DESC');
    res.json(result.rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications '});
  }
})


//route to create a new application
app.post('/api/applications', async (req, res) => {
  try {
    const { company, role, location, status, salary, url } = req.body;
    const result = await pool.query('INSERT INTO applications (company, role, location, salary, url) VALUES ($1, $2, $3, $4, $5) RETURNING *' , 
                                    [company, role, location, salary, url]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create application '});
  }
});
/* command to test post route
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d '{"company":"Test Co","role":"Software Engineer","location":"Seattle, WA","salary":"$110K-$130K","url":"https://example.com/job/123"}'
*/


//update an existing application
app.patch('/api/applications/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
    const result = await pool.query('UPDATE applications SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application' });
  }
});
/*  command to test patch route
curl -X PATCH http://localhost:3001/api/applications/1 -H "Content-Type: application/json" -d '{"status": "interviewing"}' 
*/

//delete an application
app.delete('/api/applications/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query('DELETE FROM applications WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Application to delete not found' });
    } else if(result.rowCount === 1) {
      res.json({ message: 'Application deleted' });
    }
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});
/* command to test delete route
curl -X DELETE http://localhost:3001/api/applications/1
*/


//get interviews from an application
app.get('/api/applications/:id/interviews', async (req, res) => {
  try {
    const id = req.params.id;
    //check if application id exists first
    const check = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    if (check.rowCount === 0) {
      return res.status(404).json({ message: 'Application ID not found'});
    }
    const result = await pool.query('SELECT * FROM interviews WHERE application_id = $1 ORDER BY round_number ASC', [id]);
    res.json(result.rows);
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to retrieve interviews for this application'});
  }
});


//add an interview to an application
app.post('/api/applications/:id/interviews', async (req, res) => {
  try {
    const id = req.params.id;
    //count number of existing interviews for this application to calculate the round_number of this new interview
    const interviewCount = await pool.query('SELECT COUNT(*) FROM interviews WHERE application_id = $1', [id]);
    const roundNumber = parseInt(interviewCount.rows[0].count) + 1;
    const { type, scheduled_date, outcome, notes} = req.body;
    const result = await pool.query('INSERT INTO interviews (application_id, round_number, type, scheduled_date, outcome, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [id, roundNumber, type, scheduled_date, outcome, notes]);
    res.status(201).json(result.rows[0]);
  } catch(err) {
    console.log(err);
    res.status(500).json({error: 'Failed to add interview to application'});
  }
});
/* command to test post route for interviews
 curl -X POST http://localhost:3001/api/applications/3/interviews -H "Content-Type: application/json" -d '{"type": "phone screen", "scheduled_date": "2026-07-02", "outcome": "pending"}'
 curl -X POST http://localhost:3001/api/applications/3/interviews -H "Content-Type: application/json" -d '{"type": "technical", "scheduled_date": "2026-07-11", "outcome": "pending"}'
 */


//update an interview of an application
app.patch('/api/interviews/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const { type, scheduled_date, outcome, notes } = req.body;
    const result = await pool.query('UPDATE interviews SET type = COALESCE($1, type), scheduled_date = COALESCE($2, scheduled_date), outcome = COALESCE($3, outcome), notes = COALESCE($4,  notes) WHERE id = $5 RETURNING *', [type, scheduled_date, outcome, notes, id]);
    res.json(result.rows[0]);
  } catch(err) {
    console.log(err);
    res.status(500).json({error: 'Failed to update interview'});
  }
});
/* command to test patch route for interviews
 curl -X PATCH http://localhost:3001/api/interviews/1 -H "Content-Type: application/json" -d '{"scheduled_date": "2026-07-02", "outcome": "failed"}'
 curl -X PATCH http://localhost:3001/api/interviews/2 -H "Content-Type: application/json" -d '{"outcome": "passed"}'
 */


//delete an interview from an application
app.delete('/api/interviews/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const result = await pool.query('DELETE FROM interviews WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Interview to delete not found' });
    } else if(result.rowCount === 1) {
      res.json({ message: 'Interview deleted' });
    }
  } catch(err) {
    console.log(err);
    res.status(500).json({error: 'Failed to delete interview'});
  }
});
/* command to test delete route for interview
curl -X DELETE http://localhost:3001/api/interviews/2
*/


//start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});