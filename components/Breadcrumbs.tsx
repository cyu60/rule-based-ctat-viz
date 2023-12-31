// import { HomeIcon } from '@heroicons/react/20/solid'

export default function Breadcrumbs({ phase }: { phase: string }) {
    const phases = [
      { name: "Match", href: "#", current: phase === "Match" },
      { name: "Conflict resolution", href: "#", current: phase === "Conflict resolution" },
      { name: "Action", href: "#", current: phase === "Action" },
    ];
  // Filter the phases array to contain only the first three phases
  const displayedPages = phases.slice(0, 3);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol
        role="list"
        className="flex space-x-4 rounded-md bg-white px-6 shadow"
      >
        {displayedPages.map((page, index) => (
          <li key={page.name} className="flex">
            <div className="flex items-center">
              {index !== 0 && (
                <svg
                  className="h-full w-6 flex-shrink-0 text-gray-200"
                  viewBox="0 0 24 44"
                  preserveAspectRatio="none"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>
              )}
              <a
                href={page.href}
                className={`ml-4 text-sm font-medium ${
                  page.current
                    ? "text-green-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
