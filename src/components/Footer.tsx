import { Instagram, Twitter, Facebook, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#" },
  { label: "Menu", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Careers", href: "#" },
];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative bg-background border-t border-neon/30">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="font-display text-4xl md:text-5xl text-cream tracking-wide">
              HOT B<span className="text-neon">&</span>B
            </div>
            <p className="mt-4 text-muted-foreground font-body text-base max-w-xs">
              Bold flavors. No compromises.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-11 h-11 rounded-full bg-charcoal border border-cream/10 flex items-center justify-center text-cream/80 transition-all duration-300 hover:text-background hover:bg-neon hover:border-neon hover:shadow-neon"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="font-display text-neon text-lg tracking-widest uppercase mb-6">
              Explore
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-cream/80 hover:text-neon transition-colors duration-300 relative group inline-block"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-neon transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h4 className="font-display text-neon text-lg tracking-widest uppercase mb-6">
              Find Us
            </h4>
            <ul className="space-y-5">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-neon/70 mt-0.5 flex-shrink-0" />
                <span className="font-body text-cream/70 text-sm leading-relaxed">
                Majitar, Rangpo, Sikkim 737136
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-neon/70 flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="font-body text-cream/70 text-sm hover:text-neon transition-colors"
                >
                  +91 9000000000
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-neon/70 flex-shrink-0" />
                <a
                  href="mailto:hello@hotbubbleburgers.com"
                  className="font-body text-cream/70 text-sm hover:text-neon transition-colors"
                >
                  hello@hotbubbleburgers.com
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Clock className="w-5 h-5 text-neon/70 flex-shrink-0" />
                <span className="font-body text-cream/70 text-sm">
                  Mon–Sun: 11AM – 11PM
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div>
            <h4 className="font-display text-neon text-lg tracking-widest uppercase mb-6">
              Get The Deals
            </h4>
            <p className="font-body text-cream/60 text-sm mb-5 leading-relaxed">
              Subscribe for exclusive offers and new drops.
            </p>
            <form
              className="space-y-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-charcoal border border-cream/15 text-cream placeholder:text-cream/30 font-body text-sm outline-none transition-all duration-300 focus:border-neon/50 focus:ring-1 focus:ring-neon/20"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-neon text-background font-body font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-neon hover:scale-[1.02] active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/8">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-cream/40 font-body text-xs">
            &copy; 2025 House of Bubble Tea & Burgers. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-cream/40 font-body text-xs hover:text-neon transition-colors"
            >
              Privacy Policy 
            </a>
            <a
              href="#"
              className="text-cream/40 font-body text-xs hover:text-neon transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
