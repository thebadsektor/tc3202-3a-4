// Button.jsx - Reusable button component for the Landing Page

const Button = ({ children, className, variant, onClick }) => {
  const baseClasses = "py-2 px-4 rounded-md font-medium transition-all";
  const variantClasses = {
    primary: "bg-[#3B82F6] hover:bg-[#2563EB] text-white",
    outline: "border border-[#1E293B] hover:bg-[#1E293B] text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${
        variantClasses[variant] || variantClasses.primary
      } ${className || ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
