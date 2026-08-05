import Link from "next/link";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";

const footerSections = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Women Clothes", href: "/shop/women-clothes" },
      { label: "Men Clothes", href: "/shop/men-clothes" },
      { label: "Jewelry", href: "/shop/jewelry" },
      { label: "Gabi", href: "/shop/gabi" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Buyer Dashboard", href: "/buyer-dashboard" },
      { label: "Seller Dashboard", href: "/seller-dashboard" },
    ],
  },
  {
    title: "Saba",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Become a Seller", href: "/seller-login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center">
              <span className="text-3xl font-bold tracking-normal text-primary-foreground">Saba</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/80">
              A marketplace for Ethiopian fashion, handmade pieces, and verified local designers.
            </p>
            <div className="mt-5 space-y-2 text-sm text-primary-foreground/85">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                Ethiopia
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                +251 911 121 314
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                hello@saba.com
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">{section.title}</h3>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-primary-foreground/75 transition hover:text-primary-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-primary-foreground/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-primary-foreground/75">
            © {new Date().getFullYear()} Saba Marketplace. All rights reserved.
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground/80 transition hover:border-primary-foreground hover:text-primary-foreground"
            aria-label="Saba on Instagram"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
