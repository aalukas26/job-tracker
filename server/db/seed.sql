-- Sample data for local development/demo purposes.
-- Clears existing data and resets ids, so this can be run repeatedly on a fresh schema.
TRUNCATE applications RESTART IDENTITY CASCADE;

INSERT INTO applications (company, role, location, status, salary, url) VALUES
  ('Meta', 'Software Engineer', 'Remote', 'interviewing', '$130K-$150K', 'https://metacareers.com'),
  ('Amazon', 'Frontend Engineer', 'Seattle, WA', 'applied', '$120K-$140K', 'https://amazon.jobs'),
  ('Apple', 'Product Engineer', 'Cupertino, CA', 'offer', '$135K-$155K', 'https://apple.com/careers'),
  ('Netflix', 'Backend Engineer', 'Los Gatos, CA', 'rejected', '$125K-$145K', 'https://jobs.netflix.com'),
  ('Google', 'Full Stack Engineer', 'Mountain View, CA', 'accepted', '$140K-$160K', 'https://careers.google.com');

INSERT INTO interviews (application_id, round_number, type, scheduled_date, outcome, notes) VALUES
  (1, 1, 'phone screen', '2026-06-10', 'passed', 'Good conversation with the recruiter'),
  (1, 2, 'technical', '2026-06-20', 'pending', NULL),
  (3, 1, 'phone screen', '2026-05-15', 'passed', NULL),
  (3, 2, 'technical', '2026-05-22', 'passed', 'Pairing exercise went well'),
  (3, 3, 'final', '2026-05-30', 'passed', 'Met with the team lead'),
  (5, 1, 'phone screen', '2026-05-01', 'passed', NULL);
