// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { toast } from "sonner";

// import logo from "@/assets/logo-black.png";

// function Footer() {
//   const [email, setEmail] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const normalizedEmail = email.trim().toLowerCase();

//     if (!normalizedEmail) {
//       toast.error("Please enter your email address.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await fetch("/api/newsletter", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email: normalizedEmail }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success(data.message ?? "You are subscribed.");
//         setEmail("");
//       } else {
//         toast.error(data.error || "Something went wrong. Please try again.");
//       }
//     } catch (error) {
//       console.error("Newsletter signup error:", error);
//       toast.error("Network error. Please check your connection and try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Social media icons with correct SVGs
//   const socialLinks = [
//     {
//       name: "Facebook",
//       href: "https://facebook.com/yourpage", // replace with actual URL
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="currentColor"
//           className="w-5 h-5"
//         >
//           <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
//         </svg>
//       ),
//     },
//     {
//       name: "Twitter",
//       href: "https://twitter.com/yourpage", // replace with actual URL
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="currentColor"
//           className="w-5 h-5"
//         >
//           <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
//         </svg>
//       ),
//     },
//     {
//       name: "Instagram",
//       href: "https://instagram.com/yourpage", // replace with actual URL
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="currentColor"
//           className="w-5 h-5"
//         >
//           <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311 1.266-.058 1.646-.07 4.85-.07zM12 7.378c-2.552 0-4.622 2.07-4.622 4.622S9.448 16.622 12 16.622s4.622-2.07 4.622-4.622S14.552 7.378 12 7.378zm0 7.5c-1.589 0-2.878-1.289-2.878-2.878S10.411 9.122 12 9.122s2.878 1.289 2.878 2.878-1.289 2.878-2.878 2.878zm4.832-7.928c0 .596-.483 1.079-1.079 1.079s-1.079-.483-1.079-1.079.483-1.079 1.079-1.079 1.079.483 1.079 1.079z" />
//         </svg>
//       ),
//     },
//     {
//       name: "YouTube",
//       href: "https://youtube.com/yourpage", // replace with actual URL
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="currentColor"
//           className="w-5 h-5"
//         >
//           <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
//         </svg>
//       ),
//     },
//   ];

//   return (
//     <footer className="Footerback relative bg-cover bg-center py-10 text-black sm:py-12">
//       <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
//         <div className="mt-10 flex flex-col items-center text-center sm:mt-20">
//           <Image
//             src={logo}
//             alt="U Guide"
//             className="mb-2 h-auto w-48 max-w-full sm:w-64"
//             priority={false}
//           />

//           <div className="ml-2 flex items-center justify-between gap-4 sm:gap-6">
//             {socialLinks.map((social, i) => (
//               <a
//                 key={i}
//                 href={social.href}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white transition-colors duration-300 hover:bg-[#8a5326]"
//                 aria-label={social.name}
//               >
//                 {social.icon}
//               </a>
//             ))}
//           </div>
//         </div>

//         <div className="my-7 border-t border-black/40" />

//         <div className="grid gap-8 md:grid-cols-[1fr_1fr_1.24fr] md:gap-10 lg:gap-14.5">
//           <div>
//             <h3 className="mb-3.5 text-[20px] font-semibold leading-none tracking-[-0.02em] sm:text-[23px]">Contact</h3>
//             <p className="text-[16px] leading-[1.8] tracking-[-0.02em] text-black/88 sm:text-[18px] sm:leading-[2.05]">
//               021 Hollywood Boulevard, LA <br />
//               customer@example.com <br />
//               (021) 345-6789
//             </p>
//           </div>

//           <div>
//             <h3 className="mb-3.5 text-[20px] font-semibold leading-none tracking-[-0.02em] sm:text-[23px]">Services</h3>
//             <ul className="space-y-0.5 text-[16px] leading-[1.65] tracking-[-0.02em] text-black/88 sm:text-[18px] sm:leading-[1.9]">
//               <li>Availability</li>
//               <li>Quote-Reserve</li>
//               <li>UGUIDE Pheasant Outlook</li>
//               <li>Day Use</li>
//               <li>Rates</li>
//               <li>Discounts</li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="mb-3.5 text-[20px] font-semibold leading-none tracking-[-0.02em] sm:text-[23px]">Newsletters</h3>
//             <p className="mb-4.5 text-[16px] leading-[1.55] tracking-[-0.02em] text-black/88 sm:text-[18px] sm:leading-[1.65]">
//               Sign up your email and get news and updates
//             </p>

//             <form
//               onSubmit={handleSubmit}
//               className="flex w-full max-w-87.5 flex-col gap-3 rounded-lg bg-white p-3 shadow-[0_1px_0_rgba(0,0,0,0.05)] sm:h-14.5 sm:flex-row sm:items-center sm:gap-0 sm:px-2.5 sm:py-2"
//             >
//               <input
//                 type="email"
//                 placeholder="Your email here"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="min-w-0 flex-1 border-b border-black/55 px-0.5 pb-px text-[16px] tracking-[-0.02em] text-black placeholder:text-black/55 focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:h-full sm:text-[18px]"
//                 disabled={isSubmitting}
//                 aria-label="Email address"
//               />
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="inline-flex h-10.5 shrink-0 items-center justify-center rounded-sm bg-black px-5 text-[13px] font-semibold tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#241206] disabled:cursor-not-allowed disabled:opacity-50 sm:ml-2.5 sm:text-[14px]"
//               >
//                 {isSubmitting ? "SUBMITTING" : "SUBSCRIBE"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//       <div className="relative z-10 mx-auto max-w-243.5 px-6 sm:px-10 lg:px-0">
//         <div className="border-t border-black/40" />
//       </div>
//       <p className="relative z-10 pb-2.5 pt-4.5 text-center text-[15px] tracking-[-0.01em] text-black/85">
//         © 2026 UGUIDE South Dakota Pheasant Hunting®
//       </p>
//     </footer>
//   );
// }

// export default Footer;





"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from "@/assets/logo-black.png";

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12a10 10 0 1 0-11 9.95v-7.05h-2v-2.9h2v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.9h2.3l-.3 2.9h-2v7.05A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23 3a10.9 10.9 0 0 1-3.14.86 4.48 4.48 0 0 0 2-2.48 9.06 9.06 0 0 1-2.84 1.08A4.52 4.52 0 0 0 16.63 2c-2.5 0-4.51 2.03-4.51 4.53 0 .35.04.69.11 1.02-3.75-.19-7.08-1.98-9.3-4.7a4.51 4.51 0 0 0-.61 2.28c0 1.57.8 2.96 2 3.77a4.52 4.52 0 0 1-2.05-.57v.06c0 2.2 1.56 4.03 3.63 4.44-.38.1-.78.15-1.19.15-.29 0-.58-.03-.86-.08.58 1.8 2.26 3.12 4.24 3.16A9.06 9.06 0 0 1 1 19.54 12.8 12.8 0 0 0 7 21c8.32 0 12.87-6.9 12.87-12.87 0-.2 0-.41-.01-.61A9.22 9.22 0 0 0 23 3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.2c3.2 0 3.6.01 4.9.07 1.2.06 2 .25 2.5.42.6.21 1.05.46 1.5.91.45.45.7.9.91 1.5.17.5.36 1.3.42 2.5.06 1.3.07 1.7.07 4.9s-.01 3.6-.07 4.9c-.06 1.2-.25 2-.42 2.5-.21.6-.46 1.05-.91 1.5-.45.45-.9.7-1.5.91-.5.17-1.3.36-2.5.42-1.3.06-1.7.07-4.9.07s-3.6-.01-4.9-.07c-1.2-.06-2-.25-2.5-.42-.6-.21-1.05-.46-1.5-.91-.45-.45-.7-.9-.91-1.5-.17-.5-.36-1.3-.42-2.5C2.21 15.6 2.2 15.2 2.2 12s.01-3.6.07-4.9c.06-1.2.25-2 .42-2.5.21-.6.46-1.05.91-1.5.45-.45.9-.7 1.5-.91.5-.17 1.3-.36 2.5-.42C8.4 2.21 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3.01 7 .07 5.7.13 4.6.33 3.7.64c-.9.31-1.7.72-2.5 1.5S.95 3.6.64 4.5C.33 5.4.13 6.5.07 7.8.01 9.1 0 9.5 0 12s.01 2.9.07 4.2c.06 1.3.26 2.4.57 3.3.31.9.72 1.7 1.5 2.5s1.6 1.19 2.5 1.5c.9.31 2 .51 3.3.57C8.3 23.99 8.7 24 12 24s3.7-.01 5-.07c1.3-.06 2.4-.26 3.3-.57.9-.31 1.7-.72 2.5-1.5s1.19-1.6 1.5-2.5c.31-.9.51-2 .57-3.3.06-1.3.07-1.7.07-5s-.01-3.7-.07-5c-.06-1.3-.26-2.4-.57-3.3-.31-.9-.72-1.7-1.5-2.5s-1.6-1.19-2.5-1.5c-.9-.31-2-.51-3.3-.57C15.7.01 15.3 0 12 0z" />
      <path d="M12 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.8-.9-2.3-1C16.3 2.3 12 2.3 12 2.3h0s-4.3 0-8.4.5c-.5.1-1.5.1-2.3 1-.6.7-.8 2.4-.8 2.4S0 8 0 9.8v4.4c0 1.8.2 3.6.2 3.6s.2 1.7.8 2.4c.8.9 1.8.9 2.3 1 4.1.5 8.4.5 8.4.5s4.3 0 8.4-.5c.5-.1 1.5-.1 2.3-1 .6-.7.8-2.4.8-2.4s.2-1.8.2-3.6V9.8c0-1.8-.2-3.6-.2-3.6zM9.8 15.1V8.9l6.1 3.1-6.1 3.1z" />
    </svg>
  );
}

export default function Footer() {
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
        headers: { 'Content-Type': 'application/json' },
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

  const socialLinks = [
    { Icon: FacebookIcon, href: "https://www.facebook.com/yourpage" },
    { Icon: TwitterIcon, href: "https://twitter.com/yourhandle" },
    { Icon: InstagramIcon, href: "https://www.instagram.com/yourhandle" },
    { Icon: YoutubeIcon, href: "https://www.youtube.com/yourchannel" },
  ];

  return (
    <footer className="Footerback relative bg-cover bg-center py-4 text-black">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <Image src={logo} alt="U Guide" className="mb-3 mt-20" />

          <div className="flex gap-4 mt-2">
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

        <div className="border-t border-black/40 my-10"></div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <p className="text-sm leading-7">
              021 Hollywood Boulevard, LA <br />
              customer@example.com <br />
              (021) 345-6789
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
            <h3 className="mb-3.5 text-[20px] font-semibold leading-none tracking-[-0.02em] sm:text-[23px]">Newsletters</h3>
            <p className="mb-4.5 text-[16px] leading-[1.55] tracking-[-0.02em] text-black/88 sm:text-[18px] sm:leading-[1.65]">
              Sign up your email and get news and updates
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-87.5 flex-col gap-3 rounded-lg bg-white p-3 shadow-[0_1px_0_rgba(0,0,0,0.05)] sm:h-14.5 sm:flex-row sm:items-center sm:gap-0 sm:px-2.5 sm:py-2"
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
          </div>
        </div>
      </div>
      <p className="text-center text-sm mt-8">
        © 2026 UGUIDE South Dakota Pheasant Hunting®
      </p>
    </footer>
  );
}