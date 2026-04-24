import { FormEvent, useDeferredValue, useEffect, useOptimistic, useState, useTransition } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useSession } from '../app/SessionContext';
import { currentUser } from '../mocks/data';
import { applicationsRepository, usersRepository } from '../mocks/repositories';
import type { TournamentDetailDTO, UserDTO } from '../shared/api/contracts';

interface ApplicationLoaderData {
  tournament: TournamentDetailDTO;
  slotNo: number;
}

interface OptimisticSubmission {
  teamName: string;
  members: string[];
}

export const ApplicationPage = () => {
  const { tournament, slotNo } = useLoaderData() as ApplicationLoaderData;
  const slot = tournament.bracket.find((item) => item.slotNo === slotNo);
  const navigate = useNavigate();
  const { role, refreshUnread } = useSession();
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState(['', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<UserDTO[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const activeQuery = activeIndex === null ? '' : members[activeIndex];
  const deferredQuery = useDeferredValue(activeQuery);
  const [optimisticSubmission, addOptimisticSubmission] = useOptimistic<
    OptimisticSubmission | null,
    OptimisticSubmission
  >(null, (_current, next) => next);

  useEffect(() => {
    const query = deferredQuery.trim();
    if (!query) {
      setSuggestions([]);
      return;
    }

    let alive = true;
    const timer = window.setTimeout(() => {
      void usersRepository.search(query).then((items) => {
        if (alive) {
          setSuggestions(items);
        }
      });
    }, 180);

    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [deferredQuery]);

  if (role === 'guest') {
    return (
      <section className="page-hero compact">
        <p className="eyebrow">Auth required</p>
        <h1>Заявка доступна после входа</h1>
        <p>Гость может смотреть турниры и новости, но заявку на слот отправляет авторизованный пользователь.</p>
        <Link
          className="button primary"
          to={`/auth/login?returnTo=${encodeURIComponent(`/tournaments/${tournament.slug}/apply/${slotNo}`)}`}
        >
          Войти
        </Link>
      </section>
    );
  }

  if (!slot || slot.state !== 'empty') {
    return (
      <section className="page-hero compact">
        <p className="eyebrow">Slot unavailable</p>
        <h1>Слот недоступен</h1>
        <p>Выбранный слот уже занят или не существует.</p>
        <Link className="button primary" to={`/tournaments/${tournament.slug}`}>
          Вернуться к сетке
        </Link>
      </section>
    );
  }

  const updateMember = (index: number, value: string) => {
    setMembers((current) => current.map((member, currentIndex) => (currentIndex === index ? value : member)));
  };

  const selectSuggestion = (index: number, username: string) => {
    updateMember(index, username);
    setSuggestions([]);
  };

  const validate = () => {
    const normalizedTeam = teamName.trim();
    const normalizedMembers = members.map((member) => member.trim()).filter(Boolean);
    const unique = new Set([currentUser.username, ...normalizedMembers].map((member) => member.toLowerCase()));

    if (normalizedTeam.length < 2) {
      return 'Название команды должно быть не короче 2 символов.';
    }

    if (normalizedMembers.length !== 5) {
      return 'Нужно указать пять тиммейтов, капитан уже добавлен первым слотом.';
    }

    if (unique.size !== 6) {
      return 'В составе не должно быть повторяющихся игроков.';
    }

    return '';
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();
    setError(validationError);
    if (validationError) {
      return;
    }

    const payload = {
      slotNo,
      teamName: teamName.trim(),
      members: [currentUser.username, ...members.map((member) => member.trim())]
    };

    setIsSubmitting(true);

    startTransition(() => {
      addOptimisticSubmission(payload);
      void applicationsRepository
        .submit(tournament.slug, payload)
        .then(() => {
          refreshUnread();
          navigate(`/tournaments/${tournament.slug}`);
        })
        .catch((submissionError: unknown) => {
          setError(submissionError instanceof Error ? submissionError.message : 'Не удалось отправить заявку.');
          setIsSubmitting(false);
        });
    });
  };

  return (
    <div className="stack-xl">
      <section className="page-hero compact">
        <p className="eyebrow">Team application</p>
        <h1>
          Заявка на {tournament.title}, слот {slot.seed}
        </h1>
        <p>
          Первый прямоугольник занят капитаном. Еще пять полей ищут игроков по моковому каталогу и сохраняют
          заявку в сетку optimistic-потоком.
        </p>
      </section>

      <form className="application-layout" onSubmit={handleSubmit}>
        <section className="panel form-panel">
          <label className="field">
            <span>Название команды</span>
            <input value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder="Например, Metro Haze" />
          </label>

          <div className="member-grid">
            <div className="member-card captain">
              <span>Captain</span>
              <strong>{currentUser.username}</strong>
            </div>
            {members.map((member, index) => (
              <label className="member-card editable" key={index}>
                <span>Player {index + 2}</span>
                <input
                  value={member}
                  onChange={(event) => updateMember(index, event.target.value)}
                  onFocus={() => setActiveIndex(index)}
                  placeholder="Ник игрока"
                />
                {activeIndex === index && suggestions.length > 0 ? (
                  <div className="suggestions">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onMouseDown={() => selectSuggestion(index, suggestion.username)}
                      >
                        {suggestion.username}
                      </button>
                    ))}
                  </div>
                ) : null}
              </label>
            ))}
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="form-actions">
            <Link className="button ghost" to={`/tournaments/${tournament.slug}`}>
              Отмена
            </Link>
            <button className="button primary" disabled={isSubmitting || isPending} type="submit">
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </div>
        </section>

        <aside className="panel side-panel">
          <p className="eyebrow">Preview</p>
          <h2>{optimisticSubmission?.teamName || teamName || 'Команда пока без названия'}</h2>
          <p>После отправки этот блок появится в сетке со статусом «ожидает подтверждения».</p>
          <ul className="check-list">
            {(optimisticSubmission?.members ?? [currentUser.username, ...members]).map((member, index) => (
              <li key={`${member}-${index}`}>{member || `Игрок ${index + 1}`}</li>
            ))}
          </ul>
        </aside>
      </form>
    </div>
  );
};
