-- Sample data for local development/demo purposes.
-- Clears existing data and resets ids, so this can be run repeatedly on a fresh schema.
-- Applications are inserted least-interviewed first, since the API orders by id DESC
-- (most recently inserted shows up first) -- so the last row here appears first in the UI.
TRUNCATE applications RESTART IDENTITY CASCADE;

INSERT INTO applications (company, role, location, status, salary, url) VALUES
  ('Netflix', 'Backend Engineer', 'Los Gatos, CA', 'rejected', '$125K-$145K', 'https://jobs.netflix.com'),
  ('Amazon', 'Frontend Engineer', 'Seattle, WA', 'applied', '$120K-$140K', 'https://amazon.jobs'),
  ('Google', 'Full Stack Engineer', 'Mountain View, CA', 'accepted', '$140K-$160K', 'https://careers.google.com'),
  ('Meta', 'Software Engineer', 'Remote', 'interviewing', '$130K-$150K', 'https://metacareers.com'),
  ('Apple', 'Product Engineer', 'Cupertino, CA', 'offer', '$135K-$155K', 'https://apple.com/careers');

INSERT INTO interviews (application_id, round_number, type, scheduled_date, outcome, notes) VALUES
  (3, 1, 'phone screen', '2026-05-01', 'passed', NULL),
  (4, 1, 'phone screen', '2026-06-10', 'passed', 'Good conversation with the recruiter'),
  (4, 2, 'technical', '2026-06-20', 'pending', NULL),
  (5, 1, 'phone screen', '2026-05-15', 'passed', NULL),
  (5, 2, 'technical', '2026-05-22', 'passed', 'Pairing exercise went well'),
  (5, 3, 'final', '2026-05-30', 'passed', 'Met with the team lead');
