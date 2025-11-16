-- Add generated column
ALTER TABLE "announcements" 
ADD COLUMN search_vector tsvector 
GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, ''))
) STORED;

-- Create GIN index for faster searches
CREATE INDEX idx_search_vector ON "announcements" USING GIN(search_vector);
