export function HeroPattern() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute -top-32 left-1/2 h-[560px] w-[960px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 40% 40%, rgba(242,140,40,0.22) 0%, rgba(47,168,214,0.12) 55%, transparent 80%)",
        }}
      />
      <div
        className="absolute right-0 h-[420px] w-[600px] rounded-full blur-3xl"
        style={{
          top: "560px",
          background:
            "radial-gradient(ellipse at 80% 60%, rgba(242,140,40,0.10) 0%, transparent 70%)",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.025]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dots"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#0B2E4A" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
}
