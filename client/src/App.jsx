import './App.css'
import {useState, useEffect} from 'react'

function App() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [url, setUrl] = useState('');

  
  //fetch all applications
  const getApplications = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/applications');
      if (!response.ok) {
        throw new Error('Unable to fetch applications');
      }
      const result = await response.json();
      setApplications(result);
    } catch(err) {
        console.log(err);
    }
  };


  useEffect(() => {
    getApplications();
  }, []);
  

  //add a new application
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch(err) {
      console.log(err);
    }
  };




  return (
    <div className="App">
      <h1>Job Tracker</h1>
      <ul>
        {applications.map((app) => (
          <li key={app.id}>
            <strong>{app.company}</strong> — {app.role} ({app.location})
            <br />
            Status: {app.status} | Salary: {app.salary}
          </li>
        ))}
      </ul>


      <form onSubmit={handleSubmit}>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type='submit'>Add Application</button>
      </form>
      
    </div>
  )
}

export default App
