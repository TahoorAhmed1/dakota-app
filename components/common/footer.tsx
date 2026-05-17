
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from "@/assets/logo-black.png";

function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M22 12a10 10 0 1 0-11 9.95v-7.05h-2v-2.9h2v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.9h2.3l-.3 2.9h-2v7.05A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M23 3a10.9 10.9 0 0 1-3.14.86 4.48 4.48 0 0 0 2-2.48 9.06 9.06 0 0 1-2.84 1.08A4.52 4.52 0 0 0 16.63 2c-2.5 0-4.51 2.03-4.51 4.53 0 .35.04.69.11 1.02-3.75-.19-7.08-1.98-9.3-4.7a4.51 4.51 0 0 0-.61 2.28c0 1.57.8 2.96 2 3.77a4.52 4.52 0 0 1-2.05-.57v.06c0 2.2 1.56 4.03 3.63 4.44-.38.1-.78.15-1.19.15-.29 0-.58-.03-.86-.08.58 1.8 2.26 3.12 4.24 3.16A9.06 9.06 0 0 1 1 19.54 12.8 12.8 0 0 0 7 21c8.32 0 12.87-6.9 12.87-12.87 0-.2 0-.41-.01-.61A9.22 9.22 0 0 0 23 3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2.2c3.2 0 3.6.01 4.9.07 1.2.06 2 .25 2.5.42.6.21 1.05.46 1.5.91.45.45.7.9.91 1.5.17.5.36 1.3.42 2.5.06 1.3.07 1.7.07 4.9s-.01 3.6-.07 4.9c-.06 1.2-.25 2-.42 2.5-.21.6-.46 1.05-.91 1.5-.45.45-.9.7-1.5.91-.5.17-1.3.36-2.5.42-1.3.06-1.7.07-4.9.07s-3.6-.01-4.9-.07c-1.2-.06-2-.25-2.5-.42-.6-.21-1.05-.46-1.5-.91-.45-.45-.7-.9-.91-1.5-.17-.5-.36-1.3-.42-2.5C2.21 15.6 2.2 15.2 2.2 12s.01-3.6.07-4.9c.06-1.2.25-2 .42-2.5.21-.6.46-1.05.91-1.5.45-.45.9-.7 1.5-.91.5-.17 1.3-.36 2.5-.42C8.4 2.21 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3.01 7 .07 5.7.13 4.6.33 3.7.64c-.9.31-1.7.72-2.5 1.5S.95 3.6.64 4.5C.33 5.4.13 6.5.07 7.8.01 9.1 0 9.5 0 12s.01 2.9.07 4.2c.06 1.3.26 2.4.57 3.3.31.9.72 1.7 1.5 2.5s1.6 1.19 2.5 1.5c.9.31 2 .51 3.3.57C8.3 23.99 8.7 24 12 24s3.7-.01 5-.07c1.3-.06 2.4-.26 3.3-.57.9-.31 1.7-.72 2.5-1.5s1.19-1.6 1.5-2.5c.31-.9.51-2 .57-3.3.06-1.3.07-1.7.07-5s-.01-3.7-.07-5c-.06-1.3-.26-2.4-.57-3.3-.31-.9-.72-1.7-1.5-2.5s-1.6-1.19-2.5-1.5c-.9-.31-2-.51-3.3-.57C15.7.01 15.3 0 12 0z" />
      <path d="M12 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.8-.9-2.3-1C16.3 2.3 12 2.3 12 2.3h0s-4.3 0-8.4.5c-.5.1-1.5.1-2.3 1-.6.7-.8 2.4-.8 2.4S0 8 0 9.8v4.4c0 1.8.2 3.6.2 3.6s.2 1.7.8 2.4c.8.9 1.8.9 2.3 1 4.1.5 8.4.5 8.4.5s4.3 0 8.4-.5c.5-.1 1.5-.1 2.3-1 .6-.7.8-2.4.8-2.4s.2-1.8.2-3.6V9.8c0-1.8-.2-3.6-.2-3.6zM9.8 15.1V8.9l6.1 3.1-6.1 3.1z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setEmail("");
      } else {
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter signup error:", error);
      setMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { Icon: FacebookIcon, href: "https://www.facebook.com/yourpage" },
    { Icon: TwitterIcon, href: "https://twitter.com/yourhandle" },
    { Icon: InstagramIcon, href: "https://www.instagram.com/yourhandle" },
    { Icon: YoutubeIcon, href: "https://www.youtube.com/yourchannel" },
  ];

  return (
    <footer className="Footerback relative bg-cover bg-center py-8 text-black sm:py-10">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center pt-10">
          <Image src={logo} alt="U Guide" className="mb-3 mt-8 h-auto w-[180px] sm:mt-12 sm:w-[220px]" />

          <div className="mt-2 flex flex-wrap justify-center gap-3 sm:gap-4">
            {socialLinks.map(({ Icon, href }, i) => (
              <Link
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white hover:bg-[#f37021] transition-colors"
              >
                <Icon />
              </Link>
            ))}
          </div>
        </div>

        <div className="my-8 border-t border-black/40 sm:my-10"></div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <p className="text-sm leading-7">
              Chris Hitzeman - UGUIDE<br/>
              Faulkton, SD 57438<br/>
              chris@uguidesdpheasants.com<br/>
              (605) 598-6925
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>Availability</li>
              <li>Quote-Reserve</li>
              <li>UGUIDE Pheasant Outlook</li>
              <li>Day Use</li>
              <li>Rates</li>
              <li>Discounts</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-3.5 text-[20px] font-semibold leading-none tracking-[-0.02em] sm:text-[23px]">
              Newsletters
            </h3>
            <p className="mb-4.5 text-[16px] leading-[1.55] tracking-[-0.02em] text-black/88 sm:text-[18px] sm:leading-[1.65]">
              Sign up your email and get news and updates
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-[420px] flex-col gap-3 rounded-lg bg-white p-3 shadow-[0_1px_0_rgba(0,0,0,0.05)] sm:h-[58px] sm:flex-row sm:items-center sm:gap-0 sm:px-2.5 sm:py-2"
            >
              <input
                type="email"
                placeholder="Your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-1 border-b border-black/55 px-0.5 pb-px text-[16px] tracking-[-0.02em] text-black placeholder:text-black/55 focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:h-full sm:text-[18px]"
                disabled={isSubmitting}
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10.5 shrink-0 items-center justify-center rounded-sm bg-black px-5 text-[13px] font-semibold tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#241206] disabled:cursor-not-allowed disabled:opacity-50 sm:ml-2.5 sm:text-[14px]"
              >
                {isSubmitting ? "SUBMITTING" : "SUBSCRIBE"}
              </button>
            </form>
            {message ? <p className="mt-3 text-sm font-medium text-[#2d1a08]">{message}</p> : null}
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-sm">
        Made By https://webcraftiq.com
      </p>
      <p className="mt-2 text-center text-sm">
        © 2026 UGUIDE South Dakota Pheasant Hunting®
      </p>
    </footer>
  );
}
