interface LogoProps {
  size?: number;
  animate?: boolean;
  showText?: boolean;
  variant?: "light" | "dark";
}

export function Logo({
  size = 48,
  animate = false,
  showText = true,
  variant = "light",
}: LogoProps) {
  const textColor = variant === "light" ? "#ffffff" : "#1e3a5f";
  const subTextColor = variant === "light" ? "#99f6e4" : "#0d9488";

  return (
    <div className="flex items-center gap-3">
      {/* Logo SVG */}
      <div
        className={`relative ${animate ? "hover:scale-105 transition-transform duration-300" : ""}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#0f3460", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#0d9488", stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#14b8a6", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#0d9488", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>

          {/* Outer ring - road */}
          <circle
            cx="52"
            cy="54"
            r="36"
            fill="none"
            stroke="url(#grad1)"
            strokeWidth="10"
          />

          {/* Dashed road markings */}
          <circle
            cx="52"
            cy="54"
            r="36"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="6 5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Inner ring */}
          <circle
            cx="52"
            cy="54"
            r="22"
            fill="none"
            stroke="url(#grad1)"
            strokeWidth="7"
          />

          {/* Inner dashes */}
          <circle
            cx="52"
            cy="54"
            r="22"
            fill="none"
            stroke="white"
            strokeWidth="1.2"
            strokeDasharray="5 4"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Center dot */}
          <circle cx="52" cy="54" r="7" fill="url(#grad2)" />
          <circle cx="52" cy="54" r="3.5" fill="white" opacity="0.9" />

          {/* Pixel blocks top-left */}
          <rect
            x="18"
            y="8"
            width="11"
            height="11"
            rx="2"
            fill="#14b8a6"
            opacity="0.95"
          />
          <rect
            x="31"
            y="4"
            width="8"
            height="8"
            rx="1.5"
            fill="#14b8a6"
            opacity="0.85"
          />
          <rect
            x="41"
            y="8"
            width="6"
            height="6"
            rx="1"
            fill="#14b8a6"
            opacity="0.75"
          />
          <rect
            x="13"
            y="20"
            width="7"
            height="7"
            rx="1.5"
            fill="#14b8a6"
            opacity="0.8"
          />
          <rect
            x="10"
            y="30"
            width="5"
            height="5"
            rx="1"
            fill="#14b8a6"
            opacity="0.6"
          />
          <rect
            x="8"
            y="38"
            width="4"
            height="4"
            rx="1"
            fill="#14b8a6"
            opacity="0.4"
          />
          <rect
            x="22"
            y="17"
            width="5"
            height="5"
            rx="1"
            fill="#0d9488"
            opacity="0.7"
          />

          {/* Pixel blocks - dark squares bottom-left of pixel cluster */}
          <rect
            x="9"
            y="22"
            width="8"
            height="8"
            rx="1.5"
            fill="#0f3460"
            opacity="0.9"
          />
          <rect
            x="6"
            y="32"
            width="6"
            height="6"
            rx="1"
            fill="#0f3460"
            opacity="0.7"
          />

          {animate && (
            <circle
              cx="52"
              cy="54"
              r="42"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="1"
              opacity="0.3"
            >
              <animate
                attributeName="r"
                from="38"
                to="46"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.4"
                to="0"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          )}
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <div>
          <h1
            className="text-2xl font-bold leading-tight"
            style={{ color: textColor }}
          >
            Clear-O
          </h1>
          <p className="text-sm" style={{ color: subTextColor }}>
            Pelanggaran Lalu Lintas
          </p>
        </div>
      )}
    </div>
  );
}
