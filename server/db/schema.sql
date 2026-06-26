CREATE TABLE applications (
  id          SERIAL PRIMARY KEY,
  company     VARCHAR(100) NOT NULL,
  role        VARCHAR(100) NOT NULL,
  location    VARCHAR(100),
  status      VARCHAR(50) NOT NULL DEFAULT 'applied',   -- 'applied', 'interviewing', 'offer', 'rejected', 'accepted'
  salary      VARCHAR(50),
  url         TEXT
);

CREATE TABLE interviews (
  id              SERIAL PRIMARY KEY,
  application_id  INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  round_number    INTEGER,  -- 1, 2, 3...
  type            VARCHAR(50),  -- 'phone screen', 'technical', 'final', etc.
  scheduled_date  DATE,
  outcome         VARCHAR(50),  -- 'pending', 'passed', 'rejected'
  notes           TEXT
);
