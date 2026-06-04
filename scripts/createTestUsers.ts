import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // MUST be service role
);

async function run() {
  for (let i = 1; i <= 50; i++) {
    const email = `testuser${i}@example.com`;

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        name: `Test User ${i}`,
        is_test: true
      }
    });

    if (error) console.error(error);
    else console.log('Created:', data.user?.id);
  }
}

run();
