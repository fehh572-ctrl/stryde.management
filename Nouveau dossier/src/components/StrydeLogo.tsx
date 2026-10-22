import React, { useId } from "react";

interface MountainMarkProps {
  className?: string;
  glossy?: boolean;
}

/**
 * Exact connected 3-peak vector reproduction of the Stryde logo
 */
export const StrydeMountainMark: React.FC<MountainMarkProps> = ({
  className = "w-11 h-5",
  glossy = false,
}) => {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 340 142"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`centerRight-${uid}`} x1="170" y1="12" x2="256" y2="134" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={glossy ? "#9AF0FC" : "#67BED3"} />
          <stop offset="55%" stopColor={glossy ? "#5EC0D7" : "#53A9BF"} />
          <stop offset="100%" stopColor={glossy ? "#388BA9" : "#3E90A5"} />
        </linearGradient>
        <linearGradient id={`centerLeft-${uid}`} x1="170" y1="12" x2="88" y2="134" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={glossy ? "#8CE8F5" : "#5DB4C9"} />
          <stop offset="60%" stopColor={glossy ? "#4CAECA" : "#4698AE"} />
          <stop offset="100%" stopColor={glossy ? "#2B7798" : "#337F96"} />
        </linearGradient>
        <linearGradient id={`flankLit-${uid}`} x1="170" y1="48" x2="170" y2="122" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={glossy ? "#82E3F1" : "#58B0C5"} />
          <stop offset="100%" stopColor={glossy ? "#368AA9" : "#3D8DA3"} />
        </linearGradient>
      </defs>

      {/* Left Connected Peak */}
      <g>
        <path
          d="M74 49L122 98L113 110L74 71V49Z"
          fill={`url(#flankLit-${uid})`}
        />
        <path
          d="M74 49L4 121L56 97V108L74 95V49Z"
          fill={glossy ? `url(#centerLeft-${uid})` : "#4596AC"}
        />
      </g>

      {/* Right Connected Peak */}
      <g>
        <path
          d="M266 49L218 98L227 110L266 71V49Z"
          fill={`url(#centerLeft-${uid})`}
        />
        <path
          d="M266 49L336 121L284 97V108L266 95V49Z"
          fill={`url(#flankLit-${uid})`}
        />
      </g>

      {/* Central Tall Summit Peak */}
      <g>
        <path
          d="M170 12L82 134L141 93V108L170 88V12Z"
          fill={`url(#centerLeft-${uid})`}
        />
        <path
          d="M170 12L258 134L170 50V12Z"
          fill={`url(#centerRight-${uid})`}
        />
      </g>
    </svg>
  );
};

interface StrydeLogoProps {
  layout?: "horizontal" | "stacked";
  theme?: "dark" | "light";
  className?: string;
}

export const StrydeLogo: React.FC<StrydeLogoProps> = ({
  layout = "horizontal",
  theme = "dark",
  className = "",
}) => {
  const textColor = theme === "light" ? "text-white" : "text-[#021B3A]";

  if (layout === "stacked") {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <StrydeMountainMark className="w-24 h-10 -mb-0.5" glossy={theme === "light"} />
        <span
          className={`font-bold tracking-[-0.03em] text-[26px] leading-none ${textColor}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Stryde
        </span>
      </div>
    );
  }

  // Clean wordmark only (no square mountain box on the left in top navbar)
  return (
    <span
      className={`inline-flex items-center select-none font-bold tracking-[-0.035em] text-[25px] leading-none transition-opacity hover:opacity-80 ${textColor} ${className}`}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      Stryde
    </span>
  );
};
