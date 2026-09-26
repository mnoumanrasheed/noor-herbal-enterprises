import Image from "next/image";

interface LogoProps {
  variant?: "full" | "mark" | "wordmark";
  scheme?: "dark" | "light";
  size?: number;
  className?: string;
}

/** Animated Noor Herbal Enterprises logo */
export function Logo({ size = 48, className = "" }: LogoProps) {
  return (
    <div className="relative inline-flex items-center group">
      {/* Animated radial ambient glow behind logo */}
      <div 
        className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#c9a84c]/10 via-[#c9a84c]/30 to-[#c9a84c]/10 opacity-70 blur-md group-hover:opacity-100 transition-all duration-500 pointer-events-none"
        style={{ animation: "logoPulse 3.5s ease-in-out infinite" }}
      />
      
      {/* Logo Image with float & hover scale animation */}
      <Image
        src="/logo-02.png"
        alt="Noor Herbal Enterprises"
        width={1235}
        height={562}
        priority
        style={{ 
          height: size, 
          width: "auto", 
          animation: "logoFloat 4s ease-in-out infinite",
          filter: "drop-shadow(0 2px 8px rgba(201, 168, 76, 0.25))"
        }}
        className={`relative z-10 object-contain transition-transform duration-300 group-hover:scale-105 ${className}`}
      />

      <style>{`
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes logoPulse {
          0%, 100% { opacity: 0.35; transform: scale(0.96); }
          50% { opacity: 0.85; transform: scale(1.06); }
        }
      `}</style>
    </div>
  );
}
