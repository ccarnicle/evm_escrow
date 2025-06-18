import Link from 'next/link';

// Define the type for the pool prop for better type-safety
interface Pool {
  id: number;
  name: string;
  organizer: string;
  tokenSymbol: string;
  dues: string;
  totalPot: string;
  endsIn: string;
}

interface PoolCardProps {
  pool: Pool;
}

export default function PoolCard({ pool }: PoolCardProps) {
  return (
    <Link href={`/pool/${pool.id}`}>
      <div className="bg-secondary border border-accent rounded-lg p-6 h-full flex flex-col justify-between transition-transform hover:scale-105 hover:border-primary">
        <div>
          <h3 className="text-xl font-bold text-primary-foreground">{pool.name}</h3>
          <p className="text-sm text-foreground/60 mt-1">
            by {pool.organizer.slice(0, 6)}...{pool.organizer.slice(-4)}
          </p>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/80">Dues:</span>
              <span className="font-mono">{pool.dues === '0' ? 'Open Entry' : `${pool.dues} ${pool.tokenSymbol}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/80">Total Pot:</span>
              <span className="font-mono">{pool.totalPot} {pool.tokenSymbol}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-yellow-400">
          Closes in {pool.endsIn}
        </div>
      </div>
    </Link>
  );
}