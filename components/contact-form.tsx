"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

const initialForm: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  topic: "Customer support",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Could not send your message.");
      }

      setStatus("Thanks. Your message was sent to the Saba team.");
      setForm(initialForm);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not send your message.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-800">Full Name</label>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-800">Email</label>
          <input
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            type="email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-800">Phone</label>
          <input
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            type="tel"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="+251..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-800">Topic</label>
          <select
            value={form.topic}
            onChange={(event) => setForm({ ...form, topic: event.target.value })}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option>Customer support</option>
            <option>Order question</option>
            <option>Seller application</option>
            <option>Partnership</option>
            <option>Technical issue</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-800">Message</label>
        <textarea
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          rows={6}
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Tell us how we can help."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
      >
        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isSending ? "Sending..." : "Send Message"}
      </button>

      {status && <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">{status}</p>}
    </form>
  );
}
