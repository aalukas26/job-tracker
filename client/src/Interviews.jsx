import {useState, useEffect} from 'react'


function Interviews({applicationId}) {

    const [interviews, setInterviews] = useState([]);
    const [type, setType] = useState('');
    const [scheduled_date, setScheduledDate] = useState('');
    const [outcome, setOutcome] = useState('');
    const [notes, setNotes] = useState('');
    const [showForm, setShowForm] = useState(false);    //determines whether the form fields show up or not


    //fetch all interviews for this application
    const getInterviews = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/applications/${applicationId}/interviews`);
            if (!response.ok) {
            throw new Error('Unable to fetch interviews');
            }
            const result = await response.json();
            setInterviews(result);
        } catch(err) {
            console.log(err);
        }
    };


    //add a new interview to an application
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/api/applications/${applicationId}/interviews`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({type, scheduled_date, outcome, notes})
            });

            if(!response.ok) {
                throw new Error('Failed to add interview');
            }
            await getInterviews();

            //clear out form input fields and toggle off the form fields after submit
            setType('');
            setScheduledDate('');
            setOutcome('');
            setNotes('');
            setShowForm(false);
        } catch(err) {
            console.log(err);
        }
    };


  useEffect(() => {
    getInterviews();
  }, []);
      


    return (
        <div>
            <ul>
                {interviews.map((interview) => (
                <li key={interview.id}>
                    Round {interview.round_number} - {interview.type}
                    <br/>
                    Date: {new Date(interview.scheduled_date).toLocaleDateString()} | Outcome: {interview.outcome}
                    {interview.notes && (
                        <>
                            <br />
                            Notes: {interview.notes}
                        </>
                    )}
                </li>
                ))}
            </ul>  

        {/*conditionally render either the button or the form, so input fields aren't unnecessarily being shown */}
        {/* show only the button */}
        {!showForm && (
            <button onClick={() => setShowForm(true)}>Add Interview</button>
        )}

        {/* show only the input fields and the button */}
        {showForm && (
            <form onSubmit={handleSubmit}>
                <input
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder='Type:'
                />
                <input
                    value={scheduled_date}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    placeholder='Scheduled Date:'
                />
                <input
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder='Outcome:'
                />
                <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder='Notes:'
                />
                <button type='submit'>Add Interview</button>
        </form>          

        )}
        
        </div>
    )
}

export default Interviews