CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'nps')),
  message TEXT NOT NULL,
  nps_score INTEGER NULL CHECK (nps_score >= 0 AND nps_score <= 10),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
