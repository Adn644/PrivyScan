import { FaCheck } from "react-icons/fa";

const Loader = ({ isComplete }) => {
  if (isComplete) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#FAF1CA] bg-[#FAF1CA] text-[#0F3C65] shadow-[0_0_14px_rgba(250,241,202,0.9)] transition-all duration-300">
        <FaCheck className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="relative h-8 w-8 shrink-0 rounded-full border-2 border-[#FAF1CA] animate-spin">
      <span className="absolute left-1/2 top-1.5 h-1 w-1 -translate-x-1/2 rounded-full bg-[#FAF1CA] shadow-[0_0_14px_rgba(250,241,202,0.9)]" />
    </div>
  );
};

export default Loader;