import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-2xl font-bold">Consulting for Your Business</h2>
          <button className="bg-accent text-accent-foreground px-6 py-2 rounded-md hover:opacity-90 transition font-medium">
            Contact Us
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 border-t border-primary-foreground/20 pt-8">
          {[
            { title: "Company", links: ["About", "Careers", "Blog"] },
            { title: "Legal", links: ["Terms", "Privacy", "Cookies"] },
            { title: "Features", links: ["Analytics", "Marketing", "Support"] },
            { title: "Resources", links: ["Docs", "API", "Customers"] },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-2">{section.title}</h3>
              <ul className="space-y-1 text-sm">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:opacity-80 transition">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold mb-2">Contact</h3>
            <ul className="space-y-1 text-sm">
              <li>📞 +251 911121314</li>
              <li>📍 Saba, Ethiopia</li>
              <li>✉️ hello@saba.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} Saba. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:opacity-80 transition"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:opacity-80 transition"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:opacity-80 transition"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>

      </div>
    </footer>
  );
}
