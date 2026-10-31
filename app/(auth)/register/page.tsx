import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-off-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center font-serif text-3xl font-semibold text-deep-navy">
          GradEdge
        </Link>
        <h2 className="mt-4 text-center text-xl font-serif text-deep-navy">
          Create your researcher account
        </h2>
        <p className="mt-2 text-center text-xs text-secondary-grey">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-navy hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-cream py-8 px-6 border border-hairline sm:px-10 rounded-[3px]">
          <form className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-xs font-medium text-charcoal uppercase tracking-wider">
                Full name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                className="mt-1 block w-full border border-hairline bg-white px-3 py-2 text-sm text-charcoal placeholder-secondary-grey focus:border-navy focus:outline-none rounded-[3px]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-charcoal uppercase tracking-wider">
                Institutional or primary email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full border border-hairline bg-white px-3 py-2 text-sm text-charcoal placeholder-secondary-grey focus:border-navy focus:outline-none rounded-[3px]"
              />
            </div>

            <div>
              <label htmlFor="study_level" className="block text-xs font-medium text-charcoal uppercase tracking-wider">
                Current academic level
              </label>
              <select
                id="study_level"
                name="study_level"
                className="mt-1 block w-full border border-hairline bg-white px-3 py-2 text-sm text-charcoal focus:border-navy focus:outline-none rounded-[3px]"
              >
                <option value="phd">PhD / Doctoral Candidate</option>
                <option value="masters">Masters Researcher</option>
                <option value="undergraduate">Undergraduate Honours</option>
                <option value="researcher">Postdoctoral / Early Career Researcher</option>
                <option value="other">Other Academic</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-charcoal uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full border border-hairline bg-white px-3 py-2 text-sm text-charcoal placeholder-secondary-grey focus:border-navy focus:outline-none rounded-[3px]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-navy rounded-[3px] text-sm font-medium text-white bg-navy hover:bg-deep-navy transition-colors focus:outline-none"
              >
                Register account
              </button>
            </div>

            <p className="text-[11px] text-secondary-grey leading-tight text-center pt-2">
              By creating an account you agree to our Terms of Service and confirm your adherence to
              our Academic Integrity Code.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

