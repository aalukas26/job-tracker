import './App.css'
import Interviews from './Interviews'
import {useState, useEffect} from 'react'

function App() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [url, setUrl] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  
  //fetch all applications
  const getApplications = async () => {
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/applications');
      if (!response.ok) {
        throw new Error('Unable to fetch applications');
      }
      const result = await response.json();
      setApplications(result);
    } catch(err) {
        console.log(err);
        setError('Failed to load applications');
    }
  };


  useEffect(() => {
    getApplications();
  }, []);
  

  //add a new application
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/applications', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({company, role, location, salary, url})
      });

      if(!response.ok) {
        throw new Error('Failed to add application');
      }
      await getApplications();

      //clear out form input fields and toggle the form visibility off after submit
      setCompany('');
      setRole('');
      setLocation('');
      setSalary('');
      setUrl('');
      setShowForm(false);

    } catch(err) {
      console.log(err);
      setError('Failed to add application');
    }
  };


  //delete an application
  const handleDelete = async (id) => {
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/applications/${id}`, {
        method: 'DELETE'
      });

      if(!response.ok) {
        throw new Error('Failed to delete application');
      }
      await getApplications();
    } catch(err) {
      console.log(err);
      setError('Failed to delete application');
    }
  };

  
  //update an application
  const handleStatusChange = async (id, newStatus) => {
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/applications/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status: newStatus})
      });
      if(!response.ok) {
        throw new Error('Failed to update application status');
      }
      await getApplications();
    } catch(err) {
      console.log(err);
      setError('Failed to update application status');
    }
  };




  return (
    <div className="App">
      <h1>Job Tracker</h1>
      {error && <p className="error-message">{error}</p>}
      <ul className='applications-list'>
        {applications.map((app, index) => (
          <li
            key={app.id}
            className={`status-${app.status}`}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span className='app-company'>{app.company}</span>
            <span className='app-meta'>{app.role} — {app.location}</span>
            <div className='app-details'>
              <span className='status-pill'>{app.status}</span>
              <span>Salary: {app.salary}</span>
            </div>
            <div className='app-actions'>
              <select value={app.status} onChange={(e) => handleStatusChange(app.id,e.target.value)}>
                <option value='applied'>Applied</option>
                <option value='interviewing'>Interviewing</option>
                <option value='rejected'>Rejected</option>
                <option value='offer'>Offer Received</option>
                <option value='accepted'>Accepted</option>
              </select>
              <button className='delete-button' onClick={() => handleDelete(app.id)}>Delete</button>
            </div>
            <Interviews applicationId={app.id}/>
          </li>
        ))}
      </ul>

    {/* only show the button to add submit, not form fields*/}
    {!showForm && (
      <button onClick={() => setShowForm(true)}>Add Application</button>
    )}

    {/* show both the button and the form fields*/}
    {showForm && (
      <form onSubmit={handleSubmit}>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder='Company:'
          required
        />
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder='Role:'
          required
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder='Location:'
        />
        <input
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder='Salary'
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder='URL:'
        />
        <button type='submit'>Add Application</button>
      </form>
    )}
      
    </div>
  )
}

export default App
