interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  type: "submit" | "button" | "reset";
  color?: "primary" | "danger";
  disabled?: boolean;
  onClick?: () => void;
}

export const ButtonAction = ({ children, className, type = "button", color = "primary", disabled = false, onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer text-white ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${color === "primary" ? "bg-blue-500" : color === "danger" ? "bg-red-500" : ""} ${className}`}
    >
      {children}
    </button>
  );
};
