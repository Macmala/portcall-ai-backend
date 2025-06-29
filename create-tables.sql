-- Create the 'requests' table to store user queries
CREATE TABLE IF NOT EXISTS public.requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    port_name text NOT NULL,
    arrival_date timestamp with time zone NOT NULL,
    activity_type text NOT NULL,
    yacht_flag text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the 'checklists' table to store generated results
CREATE TABLE IF NOT EXISTS public.checklists (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    request_id uuid REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
    content jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Disable RLS for development (re-enable for production)
ALTER TABLE public.requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists DISABLE ROW LEVEL SECURITY;

-- Add comments for clarity
COMMENT ON TABLE public.requests IS 'Stores the port call requests made by users.';
COMMENT ON COLUMN public.requests.port_name IS 'The name of the port for the call.';
COMMENT ON COLUMN public.requests.activity_type IS 'e.g., Charter, Private, Bunkering.';
COMMENT ON COLUMN public.requests.yacht_flag IS 'The flag state of the yacht.';

COMMENT ON TABLE public.checklists IS 'Stores the AI-generated checklists for each request.';
COMMENT ON COLUMN public.checklists.content IS 'The structured checklist content in JSON format.';
COMMENT ON COLUMN public.checklists.request_id IS 'Links to the original user request.';