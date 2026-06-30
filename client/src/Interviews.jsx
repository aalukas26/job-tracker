import {useState, useEffect} from 'react'


function Interviews({applicationId}) {

    const [interviews, setInterviews] = useState([]);
    const [type, setType] = useState('');
    const [scheduled_date, setScheduledDate] = useState('');
    const [outcome, setOutcome] = useState('');
    const [notes, setNotes] = useState('');
    const [showForm, setShowForm] = useState(false);    //determines whether the form fields show up or not

    const [editId, setEditId] = useState(null);
    const [editType, setEditType] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editOutcome, setEditOutcome] = useState('');
    const [editNotes, setEditNotes] = useState('');

  const [error, setError] = useState(null);


    //fetch all interviews for this application
    const getInterviews = async () => {
        setError(null);
        try {
            const response = await fetch(`http://localhost:3001/api/applications/${applicationId}/interviews`);
            if (!response.ok) {
            throw new Error('Unable to fetch interviews');
            }
            const result = await response.json();
            setInterviews(result);
        } catch(err) {
            console.log(err);
            setError('Failed to load interviews');
        }
    };


    //add a new interview to an application
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
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
            setError('Failed to add interview');
        }
    };


    //edit an interview
    //store interview id and prefill fields with current data
    const startEditing = (interview) => {
        setEditId(interview.id);
        setEditType(interview.type);
        setEditDate(interview.scheduled_date?.slice(0,10));
        setEditOutcome(interview.outcome);
        setEditNotes(interview.notes || '');
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch(`http://localhost:3001/api/interviews/${editId}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({type: editType, scheduled_date: editDate, outcome: editOutcome, notes: editNotes})
            });

            if(!response.ok) {
                throw new Error('Failed to edit interview');
            }
            await getInterviews();
            setEditId(null);    //reset 'interview to edit' id
        } catch(err) {
            console.log(err);
            setError('Failed to edit interview');
        }
    };


    //delete an interview
    const handleDelete = async (id) => {
        setError(null);
        try {
            const response = await fetch(`http://localhost:3001/api/interviews/${id}`, {
                method: 'DELETE'
            });
            if(!response.ok) {
                throw new Error('Failed to delete interview');
            }
            await getInterviews();
        } catch(err) {
            console.log(err);
            setError('Failed to delete interview');
        }
    };


  useEffect(() => {
    getInterviews();
  }, []);
      


    return (
        <div className='interviews-wrapper'>
            {error && <p className="error-message">{error}</p>}
            <ul className='interview-list'>
                {interviews.map((interview) => (
                <li key={interview.id}>
                    <>
                    {interview.id === editId ? (
                        //show edit form
                        <form onSubmit={handleEdit}>
                            <input
                                value={editType}
                                onChange={(e) => setEditType(e.target.value)}
                                placeholder='Type:'
                                required
                            />
                            <input
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                                placeholder='Scheduled Date:'
                                required
                            />
                            <input
                                value={editOutcome}
                                onChange={(e) => setEditOutcome(e.target.value)}
                                placeholder='Outcome:'
                            />
                            <input
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                placeholder='Notes:'
                            />
                            <button type='submit'>Save</button>
                        </form>

                    ) : (
                        //existing normal display plus edit button
                        <>
                        <span className='interview-round'>Round {interview.round_number} — {interview.type}</span>
                        <span>{new Date(interview.scheduled_date).toLocaleDateString()} · Outcome: {interview.outcome}</span>
                        {interview.notes && (
                            <span>Notes: {interview.notes}</span>
                        )}
                        <div className='app-actions'>
                            <button className='edit-button' onClick={() => startEditing(interview)}>Edit</button>
                            <button className='delete-button' onClick={() => handleDelete(interview.id)}>Delete</button>
                        </div>
                        </>
                    )
                    }
                    </>
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
                    required
                />
                <input
                    value={scheduled_date}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    placeholder='Scheduled Date:'
                    required
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