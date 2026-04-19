export async function httpGet<T>(url: string): Promise<T> {
  const response = await fetch(url, { method: 'GET' });
  if (!response.ok) throw new Error(`GET ${url} failed`);
  return response.json() as Promise<T>;
}

export async function httpPost<TBody, TResponse>(url: string, body: TBody): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`POST ${url} failed`);
  return response.json() as Promise<TResponse>;
}
