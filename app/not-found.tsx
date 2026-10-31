import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-paper flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-4 h-4 bg-gold mx-auto" aria-hidden="true" />
        <p className="type-micro text-tone-muted">404 Error</p>
        <h1 className="type-h1 text-tone-heading">We could not find that page.</h1>
        <p className="type-body text-tone-muted leading-relaxed">
          The link may have moved or been typed incorrectly. Here are helpful places to start:
        </p>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <Button variant="primary" href="/">
            Return to Homepage
          </Button>
          <Button variant="secondary" href="/services">
            Browse Services
          </Button>
          <Button variant="secondary" href="/faq">
            Read FAQ
          </Button>
        </div>
      </div>
    </div>
  );
}

