import { useNavigate } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  path: string;
  className?: string;
}

export const Buttonav = ({ children, path, className }: ButtonProps) => {
  const navigate = useNavigate();

  return (
    <button className={`cursor-pointer ${className}`} type="button" onClick={() => navigate(path)}>
      {children}
    </button>
  );
};
