export default function Button({
  children,
  variant = "primary",
  onClick,
}) {
  const variants = {
    primary: {
      bg: "bg-[#111111]",
      text: "text-white",
      fill: "bg-white",
      hoverText: "text-[#111111]",
    },

    secondary: {
      bg: "border border-[#111111]",
      text: "text-[#111111]",
      fill: "bg-[#111111]",
      hoverText: "text-white",
    },

    ghost: {
      bg: "",
      text: "text-[#111111]",
      fill: "bg-[#111111]",
      hoverText: "text-white",
    },
  };

  const style = variants[variant];

  return (
    <button
      onClick={onClick}
      className={`
        cursor-pointer
        group
        flex
        relative
        items-center
        justify-center
        overflow-hidden
        rounded-full
        px-3
        py-3
        text-[18px]
        font-medium
        transition-all
        duration-300
        hover:scale-[1.04]
        active:scale-95
        ${style.bg}
        ${style.text}
      `}
    >
      {/* Growing Circle */}
      <span
        className={`
          absolute
          left-1/2
          top-1/2
          h-0
          w-0
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          ${style.fill}
          transition-all
          duration-800
          ease-out
          group-hover:h-[350px]
          group-hover:w-[350px]
        `}
      />

      {/* Text Animation */}
      <span className="relative flex overflow-hidden">
        <span
          className="
            transition-transform
            duration-300
            group-hover:-translate-y-full
          "
        >
          {children}
        </span>

        <span
          className={`
            absolute
            left-0
            top-full
            transition-all
            duration-300
            group-hover:top-0
            ${style.hoverText}
          `}
        >
          {children}
        </span>
      </span>
    </button>
  );
}