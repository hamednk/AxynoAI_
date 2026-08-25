"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !contact.trim() || !message.trim()) {
      setError(t("error"));
      return;
    }

    const subject = encodeURIComponent(t("mailSubject", { name }));
    const body = encodeURIComponent(
      t("mailBody", { name, contact, message }),
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="signal-panel space-y-4 p-6 sm:p-8">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          {t("name")}
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-card-border bg-background/70 px-4 py-2.5 text-sm outline-none transition focus:border-accent"
          placeholder={t("namePlaceholder")}
        />
      </div>
      <div>
        <label htmlFor="contact" className="mb-1.5 block text-sm font-medium">
          {t("contactField")}
        </label>
        <input
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full border border-card-border bg-background/70 px-4 py-2.5 text-sm outline-none transition focus:border-accent"
          placeholder={t("contactPlaceholder")}
          dir="ltr"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          {t("message")}
        </label>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-y border border-card-border bg-background/70 px-4 py-2.5 text-sm outline-none transition focus:border-accent"
          placeholder={t("messagePlaceholder")}
        />
      </div>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      {sent ? (
        <p className="text-sm text-steel">{t("sent", { email: site.email })}</p>
      ) : null}
      <Button type="submit" className="w-full sm:w-auto">
        {t("submit")}
      </Button>
    </form>
  );
}
