-- Custom SQL migration file, put your code below! 
CREATE OR REPLACE FUNCTION check_rate_limit(rate_key TEXT, max_requests INTEGER, window_seconds INTEGER)
RETURNS VOID AS $$
DECLARE
  now TIMESTAMPTZ := clock_timestamp();
  window_length INTERVAL := make_interval(secs => window_seconds);
  current_count INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(rate_key));

  INSERT INTO rate_limits (key, count, window_start)
  VALUES (rate_key, 1, now)
  ON CONFLICT (key) DO UPDATE
  SET count = CASE
                WHEN rate_limits.window_start + window_length <= now
                  THEN 1
                  ELSE rate_limits.count + 1
              END,
      window_start = CASE
                       WHEN rate_limits.window_start + window_length <= now
                         THEN now
                         ELSE rate_limits.window_start
                     END;

  SELECT count INTO current_count FROM rate_limits WHERE key = rate_key;

  IF current_count > max_requests THEN
    RAISE EXCEPTION 'Rate limit exceeded for %', rate_key
                USING ERRCODE = 'P0429',
                  DETAIL  = format('Limit is %s requests per %s seconds..',  max_requests, window_seconds),
                  HINT    = 'Wait until the next window before retrying.';
  END IF;
END;
$$ LANGUAGE plpgsql;
