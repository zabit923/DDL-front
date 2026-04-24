# DeadLock League Frontend

Mock-first MVP по требованиям из PDF.

## Scripts

- `npm run dev` - локальный Vite dev server
- `npm run build` - TypeScript check + production build
- `npm run preview` - просмотр production build

## Implemented

- публичные страницы: главная, новости, список турниров, detail-страница турнира;
- роли публичного сайта: `guest` и `user`;
- фильтры турниров в URL: `all`, `upcoming`, `live`, `finished`;
- единый detail-экран для upcoming/live/finished турниров;
- заявка команды на свободный слот с капитаном, пятью игроками, autocomplete и optimistic update;
- onsite-уведомления с unread-счетчиком;
- API DTO и будущие FastAPI endpoints зафиксированы в `src/shared/api/contracts`.
