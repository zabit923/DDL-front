import type { Role } from '../../entities/season/model';

export function getContextFromRequest(request: Request) {
  const url = new URL(request.url);
  const fromUrl = url.searchParams.get('role');
  const role: Role = fromUrl === 'admin' || fromUrl === 'player' ? fromUrl : 'guest';
  return { url, role };
}
