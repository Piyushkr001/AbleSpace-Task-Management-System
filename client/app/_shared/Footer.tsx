"use client";

import Image from "next/image";
import Link from "next/link";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              aria-label="Taskora home"
              className="inline-flex items-center"
            >
              <Image
                src="/Images/Logo/logo_light.svg"
                alt="Taskora"
                width={300}
                height={72}
                priority
                className="block h-12 w-auto dark:hidden"
              />
              <Image
                src="/Images/Logo/logo_dark.svg"
                alt="Taskora"
                width={300}
                height={72}
                priority
                className="hidden h-12 w-auto dark:block"
              />
            </Link>

            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Focused task and project management for modern teams. Organize work, align priorities, and ship faster.
            </p>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {/* Product */}
            <div>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Product
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <Link href="/features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Tasks View
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Projects Workspace
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {currentYear} Taskora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;