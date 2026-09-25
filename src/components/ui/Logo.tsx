import Image from "next/image";

interface LogoProps {
  variant?: "full" | "mark" | "wordmark";
  scheme?: "dark" | "light";
  size?: number;
  className?: string;
}

/** The supplied Noor Herbal Enterprises logo, used consistently across the site. */
export function Logo({ size = 48, className = "" }: LogoProps) {
  return (
    <Image
      src="/logo-02.png"
      alt="Noor Herbal Enterprises"
      width={1235}
      height={562}
      priority
      style={{ height: size, width: "auto" }}
      className={`object-contain ${className}`}
    />
  );
}
