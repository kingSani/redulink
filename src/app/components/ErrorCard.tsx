export default function ErrorCard({ errors }: { errors: string[] }) {
  const hasErrors = errors.length > 0;
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity,transform] duration-300 ease-in-out ${
        hasErrors
          ? "grid-rows-[1fr] translate-y-0 opacity-100"
          : "grid-rows-[0fr] -translate-y-2 opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        {hasErrors && (
          <div
            id="url-errors"
            role="alert"
            className="mt-4 rounded-xl bg-red-500/10 p-4 text-sm leading-relaxed text-red-500"
          >
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
