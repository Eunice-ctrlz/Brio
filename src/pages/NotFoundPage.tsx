import { Button } from '@/components/Button';

export function NotFoundPage() {
  return (
    <div className="container page">
      <div className="state">
        <p className="eyebrow">Error 404</p>
        <h1>This page has wandered off</h1>
        <p>The page you’re looking for doesn’t exist or has moved.</p>
        <Button as="link" to="/">
          Back to home
        </Button>
      </div>
    </div>
  );
}