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
          Have questions about Taskora or need help setting up your team workspace? Reach out to us through our official support channels.
        </p>
      </div>
    </div>
  );
}
