import { Coffee } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            aria-label="Go to home page"
          >
            <img
              src="/assets/generated/cafe-logo.dim_512x512.png"
              alt="Cafe Finder Logo"
              className="h-10 w-10 rounded-lg"
            />
            <div className="flex items-center gap-2">
              <Coffee className="h-6 w-6 text-amber-600 dark:text-amber-500" />
              <span className="text-xl font-bold text-foreground">Cafe Finder</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
