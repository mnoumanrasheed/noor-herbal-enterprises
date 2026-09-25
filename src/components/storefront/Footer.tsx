import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { DEFAULT_CONTACT_SETTINGS, type ContactSettings } from "@/lib/site-settings";

const SHOP_LINKS = [
  { href: "/categories", label: "All products" },
  { href: "/categories/chutney", label: "Chutney" },
  { href: "/categories/pickles", label: "Pickles" },
  { href: "/categories/oils", label: "Oils" },
  { href: "/categories/shampoo", label: "Shampoo" },
];

const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Contact" },
  { href: "/cart", label: "Cart" },
];

interface FooterProps {
  contactSettings?: ContactSettings;
  footerContent?: string;
}

export function Footer({ contactSettings = DEFAULT_CONTACT_SETTINGS, footerContent = "Thoughtful pantry and personal care essentials, prepared for everyday rituals." }: FooterProps) {
  const whatsappNumber = contactSettings.phone.replace(/\D/g, "");

  return (
    <footer className="site-footer">
      <div className="site-shell px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr_1fr_1.4fr] lg:gap-10">
          <div>
            <Link href="/" aria-label="Noor Herbal Enterprises — go to homepage" className="inline-block rounded-md bg-white p-1.5">
              <Logo size={48} />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-7 text-[#aaa39a]">{footerContent}</p>
            <div className="mt-6 flex items-center gap-3">
              <a href={contactSettings.instagram} target="_blank" rel="noreferrer" className="social-link" aria-label="Follow Noor Herbal Enterprises on Instagram">
                <span aria-hidden="true">ig</span>
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="social-link" aria-label="Contact Noor Herbal Enterprises on WhatsApp">
                <span aria-hidden="true">wa</span>
              </a>
            </div>
          </div>

          <nav aria-label="Shop categories">
            <p className="footer-heading">Shop</p>
            <ul className="space-y-3">
              {SHOP_LINKS.map(({ href, label }) => (
                <li key={href}><Link href={href} className="footer-link">{label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Explore Noor Herbal Enterprises">
            <p className="footer-heading">Explore</p>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map(({ href, label }) => (
                <li key={href}><Link href={href} className="footer-link">{label}</Link></li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="footer-heading">Keep in touch</p>
            <p className="max-w-xs text-sm leading-7 text-[#aaa39a]">Questions about an order or a product? We are happy to help.</p>
            <div className="mt-5 space-y-3 text-sm">
              <a href={`mailto:${contactSettings.email}`} className="footer-link block break-words">{contactSettings.email}</a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="footer-link block">WhatsApp {contactSettings.phone}</a>
              <a href={contactSettings.instagram} target="_blank" rel="noreferrer" className="footer-link block">Instagram</a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[#312d27] pt-6 text-xs text-[#777169] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Noor Herbal Enterprises. All rights reserved.</p>
          <p>Made with care in Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
