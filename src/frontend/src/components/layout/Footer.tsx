import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          © 2026. Built with{' '}
          <Heart className="inline h-4 w-4 text-red-500 fill-red-500" aria-label="love" />{' '}
          using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-foreground transition-colors underline"
          >
            caffeine.ai
          </a>
          .
        </div>
      </div>
    </footer>
  );
}
