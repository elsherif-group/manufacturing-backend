import { Hono } from 'hono';

const app = new Hono<{ Bindings: CloudflareBindings; }>();

app.get('/', (c) => c.json({ ok: true }));

export default app;
