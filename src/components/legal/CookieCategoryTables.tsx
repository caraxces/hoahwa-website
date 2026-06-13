import { cookieConsentCopy } from "@/content/cookie-consent";

/** Per-category cookie tables for the Cookie policy page — single source of
 *  truth with the consent panel (content/cookie-consent.ts). */
export function CookieCategoryTables() {
  return (
    <div className="mt-14 flex flex-col gap-12">
      {cookieConsentCopy.categories.map((cat) => (
        <section key={cat.id}>
          <h2 className="text-[length:var(--wiro-h6)] leading-7 tracking-[-0.03em]">
            {cat.label}
            {cat.required ? (
              <span className="ml-3 text-sm tracking-[-0.02em] text-[var(--wiro-mauve)]">
                Always on
              </span>
            ) : null}
          </h2>
          <p className="mt-3 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/75">
            {cat.description}
          </p>

          {cat.details.length === 0 ? (
            <p className="mt-4 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/60">
              {cookieConsentCopy.emptyCategoryNote}
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--wiro-cod-gray)]/15">
                    {["Name", "Provider", "Purpose", "Duration"].map((h) => (
                      <th
                        key={h}
                        className="py-3 pr-6 text-sm font-medium tracking-[-0.02em] text-[var(--wiro-cod-gray)]/60"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cat.details.map((cookie) => (
                    <tr
                      key={cookie.name}
                      className="border-b border-[var(--wiro-cod-gray)]/8 align-top"
                    >
                      <td className="py-3 pr-6 text-sm tracking-[-0.02em]">
                        {cookie.name}
                      </td>
                      <td className="py-3 pr-6 text-sm tracking-[-0.02em] text-[var(--wiro-cod-gray)]/70">
                        {cookie.provider}
                      </td>
                      <td className="py-3 pr-6 text-sm leading-5 tracking-[-0.02em] text-[var(--wiro-cod-gray)]/70">
                        {cookie.purpose}
                      </td>
                      <td className="py-3 text-sm tracking-[-0.02em] text-[var(--wiro-cod-gray)]/70">
                        {cookie.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
