import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export function RouteErrorBoundary() {
  const error = useRouteError();

  let errorMessage = "An unexpected error occurred.";
  let errorStatus: number | null = null;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#07140d] px-6 text-white">
      <div className="max-w-md rounded-2xl border border-white/10 bg-black/60 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-2xl font-bold text-red-400">
          !
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {errorStatus ? `Error ${errorStatus}` : "Something went wrong"}
        </h1>
        <p className="mt-3 text-sm text-white/60">{errorMessage}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/login"
            className="rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
          >
            Go to Sign In
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Reload page
          </button>
        </div>
      </div>
    </main>
  );
}

export default RouteErrorBoundary;
