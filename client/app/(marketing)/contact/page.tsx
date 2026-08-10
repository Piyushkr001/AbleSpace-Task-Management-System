import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us | Taskora",
  description: "Get in touch with the Taskora team",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-foreground space-y-8">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Get in Touch</h1>
        <p className="text-muted-foreground leading-relaxed">
          Have questions about Taskora or need help setting up your team workspace? We&apos;re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-center space-y-3 shadow-2xs">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 mx-auto">
            <Mail className="size-5" />
          </div>
          <h3 className="font-semibold text-sm">Email Us</h3>
          <p className="text-xs text-muted-foreground">support@taskora.app</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 text-center space-y-3 shadow-2xs">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 mx-auto">
            <MessageSquare className="size-5" />
          </div>
          <h3 className="font-semibold text-sm">Community</h3>
          <p className="text-xs text-muted-foreground">Join our Discord server</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 text-center space-y-3 shadow-2xs">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 mx-auto">
            <MapPin className="size-5" />
          </div>
          <h3 className="font-semibold text-sm">Office</h3>
          <p className="text-xs text-muted-foreground">San Francisco, CA</p>
        </div>
      </div>
    </div>
  );
}
