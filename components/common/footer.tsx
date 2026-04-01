"use client";

import Image from "next/image";
import { useState } from "react";
import logo from "@/assets/logo-black.png";

function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail('');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social media icons with correct SVGs
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/yourpage", // replace with actual URL
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://twitter.com/yourpage", // replace with actual URL
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/yourpage", // replace with actual URL
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311 1.266-.058 1.646-.07 4.85-.07zM12 7.378c-2.552 0-4.622 2.07-4.622 4.622S9.448 16.622 12 16.622s4.622-2.07 4.622-4.622S14.552 7.378 12 7.378zm0 7.5c-1.589 0-2.878-1.289-2.878-2.878S10.411 9.122 12 9.122s2.878 1.289 2.878 2.878-1.289 2.878-2.878 2.878zm4.832-7.928c0 .596-.483 1.079-1.079 1.079s-1.079-.483-1.079-1.079.483-1.079 1.079-1.079 1.079.483 1.079 1.079z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com/yourpage", // replace with actual URL
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="Footerback relative bg-cover bg-center py-4 text-black">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <Image src={logo} alt="U Guide" className="mb-3 mt-20" />

          <div className="flex gap-4 mt-2">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white hover:bg-orange-600 transition-colors duration-300"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-black/40 my-10"></div>

        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <p className="text-sm leading-7">
              021 Hollywood Boulevard, LA <br />
              customer@example.com <br />
              (021) 345-6789
            </p>
          </div>

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

          <div>
            <h3 className="font-semibold mb-4">Newsletters</h3>
            <p className="text-sm mb-4">
              Sign up your email and get news and updates
            </p>

            <div className="flex bg-white rounded-md overflow-hidden w-full max-w-sm">
              <input
                type="email"
                placeholder="Your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 text-sm outline-none"
                disabled={isSubmitting}
              />
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#3b220c] text-white px-6 text-sm font-semibold disabled:opacity-50"
              >
                {isSubmitting ? '...' : 'SUBSCRIBE'}
              </button>
            </div>

            {message && (
              <p className={`text-sm mt-2 ${message.includes('Thank you') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
      <p className="text-center text-sm mt-8">
        © 2026 UGUIDE South Dakota Pheasant Hunting®
      </p>
    </footer>
  );
}

export default Footer;