-- =====================================================================
--  منصة حلقات القرآن (مَعين) — قاعدة البيانات وقواعد الحماية
--  شغّل هذا الملف مرة واحدة كاملاً في Supabase → SQL Editor
--  كل جدول يحفظ المستند في عمود data (JSON) + أعمدة مشتقة تُستخدم في الحماية.
--  الحماية مطبّقة على مستوى الخادم (Row Level Security): لا أحد يقرأ أو يكتب
--  إلا ما تسمح به صلاحياته، حتى لو حاول الوصول من خارج الواجهة.
-- =====================================================================

-- ---------- الجداول ----------
create table if not exists public.members (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  uid text generated always as (data->>'uid') stored,
  role text generated always as (data->>'role') stored,
  status text generated always as (data->>'status') stored,
  teacher_id text generated always as (data->>'teacherId') stored,
  circle_id text generated always as (data->>'circleId') stored,
  updated_at timestamptz not null default now()
);
create unique index if not exists members_uid_idx on public.members(uid) where uid is not null and uid <> '';

create table if not exists public.circles (
  id text primary key, data jsonb not null default '{}'::jsonb,
  teacher_id text generated always as (data->>'teacherId') stored,
  updated_at timestamptz not null default now());

create table if not exists public.config (
  id text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());

create table if not exists public.programs (
  id text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());

-- جداول مرتبطة بطالب واحد
do $$ declare t text; begin
  foreach t in array array['tasks','logs','progress','exams','certs','recits'] loop
    execute format('create table if not exists public.%I (
      id text primary key, data jsonb not null default ''{}''::jsonb,
      student_id text generated always as (data->>''studentId'') stored,
      updated_at timestamptz not null default now())', t);
    execute format('create index if not exists %I on public.%I(student_id)', t||'_student_idx', t);
  end loop;
end $$;

-- الملاحظات منفصلة حتى لا يقرأ الطالب ملاحظات ولي الأمر أو الملاحظات الداخلية
create table if not exists public.notes (
  id text primary key, data jsonb not null default '{}'::jsonb,
  student_id text generated always as (data->>'studentId') stored,
  audience text generated always as (data->>'audience') stored,
  updated_at timestamptz not null default now());
create index if not exists notes_student_idx on public.notes(student_id);

create table if not exists public.sessions (
  id text primary key, data jsonb not null default '{}'::jsonb,
  teacher_id text generated always as (data->>'teacherId') stored,
  circle_id text generated always as (data->>'circleId') stored,
  updated_at timestamptz not null default now());

-- الرسائل بين الطلاب وأولياء الأمور والمعلمين والإدارة (لا يقرؤها إلا طرفاها)
create table if not exists public.messages (
  id text primary key, data jsonb not null default '{}'::jsonb,
  from_id text generated always as (data->>'fromId') stored,
  to_id text generated always as (data->>'toId') stored,
  student_id text generated always as (data->>'studentId') stored,
  updated_at timestamptz not null default now());
create index if not exists messages_from_idx on public.messages(from_id);
create index if not exists messages_to_idx on public.messages(to_id);

create table if not exists public.tatt (
  id text primary key, data jsonb not null default '{}'::jsonb,
  teacher_id text generated always as (data->>'teacherId') stored,
  updated_at timestamptz not null default now());

-- سجل التعديلات (لا يقرؤه إلا مدير البرنامج)
create table if not exists public.audit_log (
  id bigserial primary key, at timestamptz not null default now(),
  actor uuid default auth.uid(), table_name text, row_id text, action text, old_data jsonb, new_data jsonb);

-- ---------- دوال الصلاحيات ----------
create or replace function public.staff_roles() returns text[] language sql immutable as
$$ select array['director','admin','supervisor','teacher','assistant','examiner'] $$;

create or replace function public.me_row() returns public.members
language sql stable security definer set search_path = public as
$$ select * from public.members where uid = auth.uid()::text and status = 'active' limit 1 $$;

create or replace function public.my_id() returns text language sql stable security definer set search_path = public as
$$ select id from public.members where uid = auth.uid()::text and status = 'active' limit 1 $$;

create or replace function public.my_role() returns text language sql stable security definer set search_path = public as
$$ select role from public.members where uid = auth.uid()::text and status = 'active' limit 1 $$;

create or replace function public.is_active_user() returns boolean language sql stable security definer set search_path = public as
$$ select exists(select 1 from public.members where uid = auth.uid()::text and status = 'active') $$;

create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = public as
$$ select coalesce(public.my_role() = any(public.staff_roles()), false) $$;

create or replace function public.is_director() returns boolean language sql stable security definer set search_path = public as
$$ select coalesce(public.my_role() = 'director', false) $$;

create or replace function public.has_director() returns boolean language sql stable security definer set search_path = public as
$$ select exists(select 1 from public.members where role = 'director' and status = 'active' and coalesce(uid,'') <> '') $$;

-- الصلاحيات الافتراضية لكل دور (مطابقة لجدول الصلاحيات في الواجهة)
create or replace function public.default_perms(r text) returns text[] language sql immutable as $$
  select case r
    when 'admin' then array['view.students','students.edit','members.approve','members.manage','circles.manage','daily.log','logs.delete','plans.edit','tasks.edit','sessions.manage','programs.manage','recits.review','notes.private','exams.manage','certs.issue','reports.view','reports.export','admin.dashboard','tatt.manage','settings.manage','ui.customize']
    when 'supervisor' then array['view.students','students.edit','members.approve','daily.log','logs.delete','plans.edit','tasks.edit','sessions.manage','programs.manage','recits.review','notes.private','exams.manage','certs.issue','reports.view','reports.export','admin.dashboard','tatt.manage']
    when 'teacher' then array['view.students','students.edit','members.approve','circles.manage','daily.log','plans.edit','tasks.edit','sessions.manage','programs.manage','recits.review','notes.private','exams.manage','certs.issue','reports.view','reports.export']
    when 'assistant' then array['view.students','daily.log','tasks.edit','sessions.manage','recits.review','reports.view']
    when 'examiner' then array['view.students','exams.manage','certs.issue','reports.view']
    else array[]::text[] end $$;

create or replace function public.default_scope(r text) returns text language sql immutable as $$
  select case r when 'admin' then 'all' when 'examiner' then 'all' when 'teacher' then 'own' else 'circles' end $$;

create or replace function public.has_perm(k text) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare m public.members; ov jsonb; rc jsonb;
begin
  select * into m from public.members where uid = auth.uid()::text and status = 'active' limit 1;
  if not found then return false; end if;
  if m.role = 'director' then return true; end if;
  if k = 'perms.manage' then return false; end if;
  if not (m.role = any(public.staff_roles())) then return false; end if;
  ov := m.data->'permOverrides'->k;
  if ov is not null and jsonb_typeof(ov) = 'boolean' then return ov::text::boolean; end if;
  select data->'roles'->m.role into rc from public.config where id = 'perms';
  if rc is not null and rc->'perms' ? k and jsonb_typeof(rc->'perms'->k) = 'boolean' then return (rc->'perms'->>k)::boolean; end if;
  return k = any(public.default_perms(m.role));
end $$;

create or replace function public.my_scope() returns text
language plpgsql stable security definer set search_path = public as $$
declare m public.members; rc jsonb;
begin
  select * into m from public.members where uid = auth.uid()::text and status = 'active' limit 1;
  if not found then return 'none'; end if;
  if m.role = 'director' then return 'all'; end if;
  if coalesce(m.data->>'scopeOverride','') <> '' then return m.data->>'scopeOverride'; end if;
  select data->'roles'->m.role into rc from public.config where id = 'perms';
  if rc is not null and coalesce(rc->>'scope','') <> '' then return rc->>'scope'; end if;
  return public.default_scope(m.role);
end $$;

create or replace function public.my_att_scope() returns text
language plpgsql stable security definer set search_path = public as $$
declare m public.members; rc jsonb;
begin
  select * into m from public.members where uid = auth.uid()::text and status = 'active' limit 1;
  if not found or m.role = 'director' then return 'data'; end if;
  if coalesce(m.data->>'attScopeOverride','') <> '' then return m.data->>'attScopeOverride'; end if;
  select data->'roles'->m.role into rc from public.config where id = 'perms';
  return coalesce(nullif(rc->>'attScope',''), 'data');
end $$;

create or replace function public.in_my_circles(sid text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.members s join public.circles c on c.id = s.circle_id
    where s.id = sid and (c.teacher_id = public.my_id() or coalesce((public.me_row()).data->'circleIds','[]'::jsonb) ? c.id)) $$;

-- ---------- المراحل والأقسام ----------
-- مرحلة الطالب: من بياناته، وإلا من حلقته
create or replace function public.student_div(sid text) returns text
language sql stable security definer set search_path = public as $$
  select coalesce(nullif(s.data->>'divisionId',''), nullif(c.data->>'divisionId',''), '')
  from public.members s left join public.circles c on c.id = s.circle_id where s.id = sid $$;
-- هل المرحلة ضمن مراحل المستخدم؟ (بدون مراحل مسندة = كل المراحل؛ المدير يرى الكل)
create or replace function public.div_ok(d text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    public.my_role() = 'director'
    or jsonb_array_length(coalesce((public.me_row()).data->'divisionIds','[]'::jsonb)) = 0
    or coalesce((public.me_row()).data->'divisionIds','[]'::jsonb) ? coalesce(d,''), false) $$;

create or replace function public.student_in_scope(sid text) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare me public.members; sc text; s public.members;
begin
  if sid is null then return false; end if;
  me := public.me_row(); if me.id is null or not (me.role = any(public.staff_roles())) then return false; end if;
  sc := public.my_scope();
  if sc = 'all' then return public.div_ok(public.student_div(sid)); end if;
  select * into s from public.members where id = sid;
  if not found then return false; end if;
  if s.teacher_id = me.id then return true; end if;
  if exists(select 1 from public.circles c where c.id = s.circle_id and c.teacher_id = me.id) then return true; end if;
  if sc = 'circles' and coalesce(me.data->'circleIds','[]'::jsonb) ? coalesce(s.circle_id,'') then return true; end if;
  return false;
end $$;

create or replace function public.circle_in_scope(cid text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(cid is not null and cid <> '' and public.is_staff() and (
    (public.my_scope() = 'all' and public.div_ok((select c.data->>'divisionId' from public.circles c where c.id = cid)))
    or exists(select 1 from public.circles c where c.id = cid and c.teacher_id = public.my_id())
    or coalesce((public.me_row()).data->'circleIds','[]'::jsonb) ? cid), false) $$;

create or replace function public.is_parent_of(sid text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.my_role() = 'parent' and coalesce((public.me_row()).data->'childIds','[]'::jsonb) ? sid, false) $$;

create or replace function public.can_view_student(sid text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    (public.has_perm('view.students') and public.student_in_scope(sid))
    or sid = public.my_id()
    or public.is_parent_of(sid), false) $$;

create or replace function public.can_attend(sid text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.has_perm('daily.log') and public.student_in_scope(sid)
    and (public.my_att_scope() <> 'circle' or public.in_my_circles(sid)), false) $$;

create or replace function public.can_view_session(d jsonb, cid text, tid text) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare me public.members; x text;
begin
  me := public.me_row(); if me.id is null then return false; end if;
  if tid = me.id then return true; end if;
  if cid is not null and cid <> '' then
    if me.role = 'student' and me.circle_id = cid then return true; end if;
    if public.is_staff() and (public.my_scope() = 'all' or exists(select 1 from public.circles c where c.id = cid and c.teacher_id = me.id) or coalesce(me.data->'circleIds','[]'::jsonb) ? cid) then return true; end if;
    if me.role = 'parent' and exists(select 1 from public.members s where s.circle_id = cid and coalesce(me.data->'childIds','[]'::jsonb) ? s.id) then return true; end if;
  end if;
  for x in select jsonb_array_elements_text(coalesce(d->'studentIds','[]'::jsonb) || coalesce(jsonb_build_array(d->>'studentId'),'[]'::jsonb)) loop
    if x is not null and public.can_view_student(x) then return true; end if;
  end loop;
  return false;
end $$;

-- ---------- حمايات إضافية على تعديل الحقول ----------
create or replace function public.members_insert_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return new; end if;               -- محرر SQL / مفتاح الخدمة
  -- الحفظ يتم بـ upsert: إذا كان السجل موجوداً فهو تعديل تحكمه سياسة التعديل وحمايته
  if exists(select 1 from public.members where id = new.id) then return new; end if;
  if public.has_perm('members.manage') then return new; end if;
  if new.data->>'uid' = auth.uid()::text then
    if exists(select 1 from public.members where uid = auth.uid()::text) then raise exception 'already registered'; end if;
    if new.data->>'role' = 'director' then
      if public.has_director() then raise exception 'director exists'; end if;
      new.data := new.data || '{"status":"active"}'::jsonb;
    else
      if coalesce(new.data->>'role','') not in ('student','teacher','parent') then raise exception 'role not allowed'; end if;
      new.data := (new.data - array['permOverrides','scopeOverride','attScopeOverride','circleIds','childIds']) || '{"status":"pending"}'::jsonb;
    end if;
    return new;
  end if;
  if public.has_perm('students.edit') and new.data->>'role' = 'student' and coalesce(new.data->>'uid','') = '' then
    new.data := new.data - array['permOverrides','scopeOverride','attScopeOverride'];
    return new;
  end if;
  raise exception 'not allowed';
end $$;

create or replace function public.members_update_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare selfkeys text[] := array['name','phone','meetLink','navPref','photo','updatedAt'];
        protected text[] := array['uid','role','permOverrides','scopeOverride','attScopeOverride','childIds','divisionIds'];
        k text;
begin
  if auth.uid() is null then return new; end if;
  if public.has_perm('members.manage') then return new; end if;
  if old.uid = auth.uid()::text then
    if (new.data - selfkeys) is distinct from (old.data - selfkeys) then raise exception 'not allowed'; end if;
    return new;
  end if;
  if old.role = 'student' then
    foreach k in array protected loop
      if (new.data->k) is distinct from (old.data->k) then raise exception 'field % not allowed', k; end if;
    end loop;
    if (new.data->>'status') is distinct from (old.data->>'status')
       and not (old.data->>'status' = 'pending' and new.data->>'status' = 'active' and public.has_perm('members.approve')) then
      raise exception 'status not allowed';
    end if;
    return new;
  end if;
  raise exception 'not allowed';
end $$;

create or replace function public.tasks_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare k text[] := array['done','doneAt','updatedAt'];
begin
  if auth.uid() is null or public.has_perm('tasks.edit') then return new; end if;
  if (new.data - k) is distinct from (old.data - k) then raise exception 'only completion can change'; end if;
  return new;
end $$;

create or replace function public.sessions_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare sid text := new.data->>'studentId';
begin
  if auth.uid() is null or public.has_perm('sessions.manage') then return new; end if;
  if tg_op = 'INSERT' and exists(select 1 from public.sessions where id = new.id) then return new; end if;
  if new.data->>'status' <> 'requested' then raise exception 'only requests allowed'; end if;
  if not (sid = public.my_id() or public.is_parent_of(sid)) then raise exception 'not your student'; end if;
  if coalesce(new.data->>'circleId','') <> '' then raise exception 'not allowed'; end if;
  return new;
end $$;

create or replace function public.recits_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or public.has_perm('recits.review') then return new; end if;
  if tg_op = 'INSERT' and exists(select 1 from public.recits where id = new.id) then return new; end if;
  if tg_op = 'INSERT' then
    if new.data->>'studentId' <> public.my_id() then raise exception 'not allowed'; end if;
    new.data := new.data || '{"status":"pending"}'::jsonb;
    return new;
  end if;
  raise exception 'not allowed';
end $$;

-- من يحق له مراسلة من
create or replace function public.can_message(target text) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare me public.members; t public.members;
begin
  select * into me from public.members where uid = auth.uid()::text and status = 'active' limit 1;
  if not found then return false; end if;
  select * into t from public.members where id = target and status = 'active';
  if not found or t.id = me.id then return false; end if;
  if me.role = any(public.staff_roles()) then
    if t.role = any(public.staff_roles()) then return true; end if;
    if t.role = 'student' then return public.student_in_scope(t.id); end if;
    if t.role = 'parent' then
      return exists(select 1 from jsonb_array_elements_text(coalesce(t.data->'childIds','[]'::jsonb)) c where public.student_in_scope(c));
    end if;
    return false;
  end if;
  if me.role not in ('student','parent') or not (t.role = any(public.staff_roles())) then return false; end if;
  if t.role in ('director','admin') then return true; end if;
  return exists(
    select 1 from public.members s
    where s.role = 'student' and s.status = 'active'
      and (s.id = me.id or (me.role = 'parent' and coalesce(me.data->'childIds','[]'::jsonb) ? s.id))
      and (s.teacher_id = t.id
        or exists(select 1 from public.circles c where c.id = s.circle_id and c.teacher_id = t.id)
        or (coalesce(s.circle_id,'') <> '' and coalesce(t.data->'circleIds','[]'::jsonb) ? s.circle_id)));
end $$;

create or replace function public.messages_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare k text[] := array['readAt','updatedAt'];
begin
  new.updated_at := now();
  if auth.uid() is null then return new; end if;
  if tg_op = 'INSERT' and exists(select 1 from public.messages where id = new.id) then return new; end if;
  if tg_op = 'INSERT' then
    if new.data->>'fromId' is distinct from public.my_id() then raise exception 'not allowed'; end if;
    if length(coalesce(new.data->>'body','')) = 0 or length(new.data->>'body') > 4000 then raise exception 'invalid message'; end if;
    new.data := (new.data - 'readAt') || jsonb_build_object('at', to_char(now() at time zone 'utc','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
    return new;
  end if;
  if (new.data - k) is distinct from (old.data - k) then raise exception 'only read status can change'; end if;
  return new;
end $$;

create or replace function public.touch_and_audit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    insert into public.audit_log(table_name,row_id,action,old_data) values (tg_table_name, old.id, 'delete', old.data);
    return old;
  end if;
  new.updated_at := now();
  insert into public.audit_log(table_name,row_id,action,old_data,new_data)
    values (tg_table_name, new.id, lower(tg_op), case when tg_op='UPDATE' then old.data end, new.data);
  return new;
end $$;

drop trigger if exists members_ins on public.members;
create trigger members_ins before insert on public.members for each row execute function public.members_insert_guard();
drop trigger if exists members_upd on public.members;
create trigger members_upd before update on public.members for each row execute function public.members_update_guard();
drop trigger if exists tasks_upd on public.tasks;
create trigger tasks_upd before update on public.tasks for each row execute function public.tasks_guard();
drop trigger if exists sessions_ins on public.sessions;
create trigger sessions_ins before insert or update on public.sessions for each row execute function public.sessions_guard();
drop trigger if exists messages_ins on public.messages;
create trigger messages_ins before insert or update on public.messages for each row execute function public.messages_guard();
drop trigger if exists recits_ins on public.recits;
create trigger recits_ins before insert or update on public.recits for each row execute function public.recits_guard();

do $$ declare t text; begin
  foreach t in array array['members','circles','config','programs','tasks','logs','progress','exams','certs','recits','notes','sessions','tatt','messages'] loop
    execute format('drop trigger if exists %I on public.%I', t||'_audit', t);
    execute format('create trigger %I before insert or update or delete on public.%I for each row execute function public.touch_and_audit()', t||'_audit', t);
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;
alter table public.audit_log enable row level security;
-- الرسائل خاصة بطرفيها، فلا تُنسخ إلى سجل التعديلات
drop trigger if exists messages_audit on public.messages;

-- ---------- السياسات (من يقرأ ومن يكتب) ----------
do $$ declare t text; p record; begin
  foreach t in array array['members','circles','config','programs','tasks','logs','progress','exams','certs','recits','notes','sessions','tatt','messages','audit_log'] loop
    for p in select policyname from pg_policies where schemaname='public' and tablename=t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
  end loop;
end $$;

-- الأعضاء
create policy members_select on public.members for select to authenticated using (
  uid = auth.uid()::text
  or (public.is_active_user() and role = any(public.staff_roles()))
  or (role = 'student' and public.can_view_student(id))
  or (role = 'student' and public.has_perm('view.students') and (teacher_id = public.my_id() or public.circle_in_scope(circle_id)))
  or public.has_perm('members.manage')
  or (status = 'pending' and role = 'student' and public.has_perm('members.approve'))
  or (role = 'parent' and public.is_staff() and exists(select 1 from jsonb_array_elements_text(coalesce(data->'childIds','[]'::jsonb)) c where public.student_in_scope(c))));
create policy members_insert on public.members for insert to authenticated with check (auth.uid() is not null);
create policy members_update on public.members for update to authenticated using (
  uid = auth.uid()::text
  or public.has_perm('members.manage')
  or (role = 'student' and (public.has_perm('students.edit') or public.has_perm('plans.edit') or public.has_perm('circles.manage') or public.has_perm('exams.manage')) and public.student_in_scope(id))
  or (role = 'student' and status = 'pending' and public.has_perm('members.approve')))
  with check (
  uid = auth.uid()::text
  or public.has_perm('members.manage')
  or (role = 'student' and public.is_staff() and (teacher_id = public.my_id() or public.student_in_scope(id) or public.circle_in_scope(circle_id))));
create policy members_delete on public.members for delete to authenticated using (public.has_perm('members.manage'));

-- الإعدادات
create policy config_select on public.config for select to authenticated using (true);
-- اسم المنصة والألوان تظهر في صفحة الدخول قبل تسجيل الدخول (لا تحتوي أي بيانات شخصية)
create policy config_public on public.config for select to anon using (id in ('main','ui'));
create policy config_write on public.config for all to authenticated
  using ((id = 'perms' and public.is_director()) or (id = 'ui' and public.has_perm('ui.customize')) or (id = 'main' and public.has_perm('settings.manage')) or (id = 'plantpl' and public.has_perm('plans.edit')))
  with check ((id = 'perms' and public.is_director()) or (id = 'ui' and public.has_perm('ui.customize')) or (id = 'main' and public.has_perm('settings.manage')) or (id = 'plantpl' and public.has_perm('plans.edit')));

-- الحلقات والبرامج
create policy circles_select on public.circles for select to authenticated using (public.is_active_user());
create policy circles_write on public.circles for all to authenticated
  using (public.has_perm('circles.manage') and (public.my_scope() = 'all' or teacher_id = public.my_id()))
  with check (public.has_perm('circles.manage') and (public.my_scope() = 'all' or teacher_id = public.my_id()));
create policy programs_select on public.programs for select to authenticated using (public.is_active_user());
create policy programs_write on public.programs for all to authenticated
  using (public.has_perm('programs.manage')) with check (public.has_perm('programs.manage'));

-- المهام
create policy tasks_select on public.tasks for select to authenticated using (public.can_view_student(student_id));
create policy tasks_insert on public.tasks for insert to authenticated with check (public.has_perm('tasks.edit') and public.student_in_scope(student_id));
create policy tasks_update on public.tasks for update to authenticated using (
  (public.has_perm('tasks.edit') and public.student_in_scope(student_id))
  or (public.has_perm('daily.log') and public.student_in_scope(student_id))
  or student_id = public.my_id());
create policy tasks_delete on public.tasks for delete to authenticated using (public.has_perm('tasks.edit') and public.student_in_scope(student_id));

-- السجل اليومي والملاحظات
create policy logs_select on public.logs for select to authenticated using (public.can_view_student(student_id));
create policy logs_insert on public.logs for insert to authenticated with check (public.can_attend(student_id));
create policy logs_update on public.logs for update to authenticated using (public.can_attend(student_id));
create policy logs_delete on public.logs for delete to authenticated using (public.has_perm('logs.delete') and public.student_in_scope(student_id));

create policy notes_select on public.notes for select to authenticated using (
  case audience
    when 'staff' then public.has_perm('notes.private') and public.student_in_scope(student_id)
    when 'parent' then public.student_in_scope(student_id) or public.is_parent_of(student_id)
    else public.can_view_student(student_id) end);
create policy notes_write on public.notes for all to authenticated
  using (public.is_staff() and public.student_in_scope(student_id) and (audience <> 'staff' or public.has_perm('notes.private')))
  with check (public.is_staff() and public.student_in_scope(student_id) and (audience <> 'staff' or public.has_perm('notes.private'))
    and (public.has_perm('daily.log') or public.has_perm('students.edit')));

-- التقدم في البرامج
create policy progress_select on public.progress for select to authenticated using (public.can_view_student(student_id));
create policy progress_write on public.progress for all to authenticated
  using (student_id = public.my_id() or (public.has_perm('programs.manage') and public.student_in_scope(student_id)))
  with check (student_id = public.my_id() or (public.has_perm('programs.manage') and public.student_in_scope(student_id)));

-- الاختبارات والشهادات
create policy exams_select on public.exams for select to authenticated using (public.can_view_student(student_id));
create policy exams_write on public.exams for all to authenticated
  using (public.has_perm('exams.manage') and public.student_in_scope(student_id))
  with check (public.has_perm('exams.manage') and public.student_in_scope(student_id));
create policy certs_select on public.certs for select to authenticated using (public.can_view_student(student_id));
create policy certs_write on public.certs for all to authenticated
  using (public.has_perm('certs.issue') and public.student_in_scope(student_id))
  with check (public.has_perm('certs.issue') and public.student_in_scope(student_id));

-- التسميع الصوتي
create policy recits_select on public.recits for select to authenticated using (public.can_view_student(student_id));
create policy recits_insert on public.recits for insert to authenticated with check (student_id = public.my_id() or (public.has_perm('recits.review') and public.student_in_scope(student_id)));
create policy recits_update on public.recits for update to authenticated using (public.has_perm('recits.review') and public.student_in_scope(student_id));
create policy recits_delete on public.recits for delete to authenticated using (public.has_perm('recits.review') and public.student_in_scope(student_id));

-- المواعيد
create policy sessions_select on public.sessions for select to authenticated using (public.can_view_session(data, circle_id, teacher_id));
create policy sessions_insert on public.sessions for insert to authenticated with check (
  public.has_perm('sessions.manage') or data->>'studentId' = public.my_id() or public.is_parent_of(data->>'studentId'));
create policy sessions_update on public.sessions for update to authenticated using (
  public.has_perm('sessions.manage') or (data->>'status' = 'requested' and (data->>'studentId' = public.my_id() or public.is_parent_of(data->>'studentId'))));
create policy sessions_delete on public.sessions for delete to authenticated using (public.has_perm('sessions.manage'));

-- الرسائل
create policy messages_select on public.messages for select to authenticated using (from_id = public.my_id() or to_id = public.my_id());
create policy messages_insert on public.messages for insert to authenticated with check (from_id = public.my_id() and public.can_message(to_id));
create policy messages_update on public.messages for update to authenticated using (to_id = public.my_id()) with check (to_id = public.my_id());

-- حضور المعلمين
create policy tatt_select on public.tatt for select to authenticated using (
  teacher_id = public.my_id() or public.has_perm('admin.dashboard') or public.has_perm('tatt.manage'));
create policy tatt_write on public.tatt for all to authenticated using (public.has_perm('tatt.manage')) with check (public.has_perm('tatt.manage'));

-- سجل التعديلات
create policy audit_select on public.audit_log for select to authenticated using (public.is_director());

-- ---------- لوحة الشرف (أسماء ونقاط فقط، بدون تفاصيل الطلاب) ----------
create or replace function public.leaderboard(p_from date, p_to date)
returns table(id text, name text, track text, points int, new_pages numeric, t_pages numeric, rate int)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_active_user() then return; end if;
  if not public.is_staff() and coalesce((select (data->>'leaderboard')::boolean from public.config where config.id='main'), false) = false then return; end if;
  return query
  with st as (select m.id, m.data->>'name' as name, m.data->>'track' as track from public.members m where m.role='student' and m.status='active'),
  lg as (select l.student_id, l.data from public.logs l where (l.data->>'date')::date between p_from and p_to),
  tk as (select t.student_id, count(*) filter (where (t.data->>'done')::boolean) as done from public.tasks t where (t.data->>'date')::date between p_from and p_to group by t.student_id)
  select st.id, st.name, st.track,
    (coalesce(tk.done,0)
     + 2*(select count(*) from lg where lg.student_id=st.id and lg.data->>'attendance' in ('present','late'))
     + 3*(select count(*) from lg, lateral (values (lg.data->>'newGrade'),(lg.data->>'revGrade'),(lg.data->>'tGrade')) g(v) where lg.student_id=st.id and g.v='5'))::int,
    coalesce((select sum(nullif(lg.data->>'newPages','')::numeric) from lg where lg.student_id=st.id),0),
    coalesce((select sum(nullif(lg.data->>'tPages','')::numeric) from lg where lg.student_id=st.id),0),
    (select case when count(*) filter (where lg.data->>'attendance' in ('present','late','absent'))=0 then null
       else round(100.0*count(*) filter (where lg.data->>'attendance' in ('present','late'))/count(*) filter (where lg.data->>'attendance' in ('present','late','absent'))) end
     from lg where lg.student_id=st.id)::int
  from st left join tk on tk.student_id=st.id
  order by 4 desc;
end $$;

-- لوحة الشرف داخل مرحلة واحدة
create or replace function public.leaderboard_div(p_from date, p_to date, p_div text)
returns table(id text, name text, track text, points int, new_pages numeric, t_pages numeric, rate int)
language sql stable security definer set search_path = public as $$
  select l.* from public.leaderboard(p_from, p_to) l
  where coalesce(p_div,'') = '' or public.student_div(l.id) = p_div $$;
grant execute on function public.leaderboard_div(date, date, text) to authenticated;

-- ---------- تقدم تحدي الحلقة (مجموع فقط، بدون تفاصيل الطلاب) ----------
create or replace function public.challenge_progress(p_circle text, p_kind text, p_from date, p_to date)
returns table(total numeric, members int)
language plpgsql stable security definer set search_path = public as $$
declare me public.members;
begin
  select * into me from public.members where uid = auth.uid()::text and status = 'active' limit 1;
  if not found then return; end if;
  if p_circle <> 'all' and not (me.role = any(public.staff_roles())) and not exists(
     select 1 from public.members s where s.role = 'student' and s.circle_id = p_circle
       and (s.id = me.id or coalesce(me.data->'childIds','[]'::jsonb) ? s.id)) then return; end if;
  return query
  with st as (select m.id from public.members m where m.role = 'student' and m.status = 'active' and (p_circle = 'all' or m.circle_id = p_circle))
  select (case p_kind
      when 'tasks' then (select count(*) from public.tasks t where t.student_id in (select id from st)
                          and coalesce((t.data->>'done')::boolean,false) and (t.data->>'date')::date between p_from and p_to)::numeric
      when 'att' then (select count(*) from public.logs l where l.student_id in (select id from st)
                          and l.data->>'attendance' in ('present','late') and (l.data->>'date')::date between p_from and p_to)::numeric
      else (select coalesce(sum(coalesce(nullif(l.data->>'tPages','')::numeric,0) + coalesce(nullif(l.data->>'newPages','')::numeric,0)),0)
              from public.logs l where l.student_id in (select id from st) and (l.data->>'date')::date between p_from and p_to)
    end),
    (select count(*)::int from st);
end $$;

grant execute on function public.leaderboard(date,date), public.has_director(), public.can_message(text), public.challenge_progress(text,text,date,date) to authenticated;

-- ---------- التحديث المباشر ----------
do $$ declare t text; begin
  foreach t in array array['members','circles','config','programs','tasks','logs','progress','exams','certs','recits','notes','sessions','tatt','messages'] loop
    begin execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null; end;
  end loop;
end $$;

-- ---------- تخزين الملفات (تسجيلات صوتية ومرفقات) ----------
insert into storage.buckets (id, name, public, file_size_limit)
values ('files', 'files', false, 20971520)
on conflict (id) do update set public = false, file_size_limit = 20971520;

drop policy if exists files_insert on storage.objects;
create policy files_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'files' and (storage.foldername(name))[1] = auth.uid()::text and public.is_active_user());
drop policy if exists files_select on storage.objects;
create policy files_select on storage.objects for select to authenticated
  using (bucket_id = 'files' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_active_user()));
drop policy if exists files_delete on storage.objects;
create policy files_delete on storage.objects for delete to authenticated
  using (bucket_id = 'files' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_director()));


-- ---------- إشعارات تصل والمنصة مقفلة (Web Push) ----------
create table if not exists public.push_subs (
  id text primary key, data jsonb not null default '{}'::jsonb,
  member_id text generated always as (data->>'memberId') stored,
  updated_at timestamptz not null default now());
alter table public.push_subs enable row level security;
drop policy if exists push_own on public.push_subs;
create policy push_own on public.push_subs for all to authenticated
  using (member_id = public.my_id()) with check (member_id = public.my_id());

-- إعدادات الإرسال (لا يقرؤها أحد من الموقع؛ تُضبط مرة واحدة من SQL Editor)
create table if not exists public.push_settings (id int primary key default 1, fn_url text, secret text);
alter table public.push_settings enable row level security;

do $$ begin create extension if not exists pg_net; exception when others then null; end $$;

create or replace function public.push_notify() returns trigger
language plpgsql security definer set search_path = public as $$
declare st public.push_settings;
begin
  select * into st from public.push_settings where id = 1;
  if st.fn_url is null or st.fn_url = '' or not exists(select 1 from public.push_subs) then return new; end if;
  perform net.http_post(
    url := st.fn_url,
    body := jsonb_build_object('table', tg_table_name, 'op', tg_op, 'id', new.id, 'data', new.data,
                               'old', case when tg_op = 'UPDATE' then old.data end),
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-push-secret', coalesce(st.secret, '')));
  return new;
exception when others then return new;
end $$;

do $$ declare t text; begin
  foreach t in array array['messages','logs','recits','sessions','exams','certs','members'] loop
    execute format('drop trigger if exists %I on public.%I', t||'_push', t);
    execute format('create trigger %I after insert or update on public.%I for each row execute function public.push_notify()', t||'_push', t);
  end loop;
end $$;

-- ---------- لوحة المالك: الجهات المشتركة (تُستخدم في نسختك الرئيسية فقط) ----------
create table if not exists public.tenants (
  id text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
alter table public.tenants enable row level security;
create or replace function public.is_platform_owner() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.is_director() and coalesce((select (data->>'ownerMode')::boolean from public.config where id = 'main'), false), false) $$;
drop policy if exists tenants_owner on public.tenants;
create policy tenants_owner on public.tenants for all to authenticated
  using (public.is_platform_owner()) with check (public.is_platform_owner());

-- تستدعيها نسخ الجهات: تُرجع حالة الاشتراك، وتحدّث إحصاءات الاستخدام (أعداد فقط)
create or replace function public.tenant_ping(p_key text, p_students int default null, p_staff int default null, p_circles int default null, p_url text default null)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare t public.tenants;
begin
  if coalesce(length(p_key), 0) < 20 then return jsonb_build_object('status', 'unknown'); end if;
  select * into t from public.tenants where data->>'key' = p_key limit 1;
  if not found then return jsonb_build_object('status', 'unknown'); end if;
  update public.tenants set data = data || jsonb_build_object('lastPing', now(),
      'stats', case when p_students is null then coalesce(data->'stats', '{}'::jsonb)
               else jsonb_build_object('students', p_students, 'staff', p_staff, 'circles', p_circles, 'at', now()) end,
      'seenUrl', coalesce(left(p_url, 200), data->>'seenUrl'))
    where id = t.id;
  return jsonb_build_object('status', coalesce(t.data->>'status', 'active'), 'expires', t.data->>'expires',
                            'message', t.data->>'message', 'name', t.data->>'name');
end $$;
grant execute on function public.tenant_ping(text, int, int, int, text) to anon, authenticated;
