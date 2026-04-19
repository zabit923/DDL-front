# DeadLock League Frontend MVP

## Run

```bash
cd frontend
npm install
npm run dev
```

## Demo controls

- `?role=guest|player|captain|organizer|admin`
- `?scenario=sponsor_heavy_homepage|preseason|registration_open|check_in_open|live_round|result_under_review|dispute_open|completed_event|empty_league`

Example:

`/tournaments/dl-open-cup-1?role=captain&scenario=live_round`

## Current architecture

- Two shells: `PublicShell` and `CompetitionShell`
- Route loaders + mock repositories
- Typed future HTTP contracts under `src/shared/api/http`
- Scenario-driven mock states under `src/mocks/scenarios`
