export default function ActionButton({
  children,
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      className={className}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
