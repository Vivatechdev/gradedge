import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-off-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center font-serif text-3xl font-semibold text-deep-navy">
          GradEdge
        </Link>
        <h2 className="mt-4 text-center text-xl font-serif text-deep-navy">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-xs text-secondary-grey">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-cream py-8 px-6 border border-hairline sm:px-10 rounded-[3px]">
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-charcoal uppercase tracking-wider">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="researcher@university.edu"
                className="mt-1 block w-full border border-hairline bg-white px-3 py-2 text-sm text-charcoal placeholder-secondary-grey focus:border-navy focus:outline-none rounded-[3px]"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-navy rounded-[3px] text-sm font-medium text-white bg-navy hover:bg-deep-navy transition-colors focus:outline-none"
            >
              Send reset instructions
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-navy hover:underline">
                Return to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

