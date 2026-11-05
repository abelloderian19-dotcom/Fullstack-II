export default function ActionButton({
  children,
  onClick,
  disabled = false,
  className = "",
  ...buttonProps
}) {
  return (
    <button
      {...buttonProps}
      className={className}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
