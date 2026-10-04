'use client';

export async function postWithFallback<T>(url: string, body: unknown, fallback: () => T): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body), signal: controller.signal
    });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return await response.json() as T;
  } catch {
    return fallback();
  } finally {
    window.clearTimeout(timer);
  }
}
