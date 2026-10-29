import type { RoleId } from '../content/site';
import { roleMeta } from '../content/projects';
import { useRole } from './Layout';

const order: RoleId[] = ['all', 'analyst', 'scientist', 'business', 'engineer'];

export function RoleSelector({ compact = false }: { compact?: boolean }) {
  const { role, setRole } = useRole();
  return (
    <div className="flex flex-col gap-3">
      <div className="seg" role="radiogroup" aria-label="View the portfolio for a role">
        {order.map((r) => (
          <button key={r} type="button" role="radio" aria-checked={role === r} aria-pressed={role === r} onClick={() => setRole(r)} className="!px-3 !py-2 !text-sm">
            {roleMeta[r].label}
          </button>
        ))}
      </div>
      {!compact && <p className="text-sm text-muted" aria-live="polite">{roleMeta[role].blurb}</p>}
    </div>
  );
}
