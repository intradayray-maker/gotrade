alter table public.profiles
add column if not exists billing_status text default 'inactive',
add column if not exists stripe_default_payment_method text;

update public.profiles
set billing_status = 'inactive'
where billing_status is null;
