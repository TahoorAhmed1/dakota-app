"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import pic1 from "@/assets/discount 6.jpg";
import pic2 from "@/assets/contact2.jpg";
import pic3 from "@/assets/contact3.jpg";
import pic4 from "@/assets/discount5.jpg";
import pic5 from "@/assets/contact6.jpg";

const fieldClassName =
  "h-[38px] w-full rounded-[2px] border border-[#9d9d9d] bg-white px-3 text-[12px] text-[#3f3124] outline-none transition placeholder:text-[#8d8d8d] focus:border-[#a65d1f] focus:ring-1 focus:ring-[#a65d1f]/25";

const textareaClassName =
  "min-h-[92px] w-full rounded-[2px] border border-[#9d9d9d] bg-white px-3 py-2 text-[12px] text-[#3f3124] outline-none transition placeholder:text-[#8d8d8d] focus:border-[#a65d1f] focus:ring-1 focus:ring-[#a65d1f]/25";

const selectChoices = {
  experience: [
    "1st time",
    "2-3 years",
    "4-6 years",
    "7+ years",
  ],
  minGroupSize: ["6", "7", "8", "9", "10"],
  maxGroupSize: ["6", "7", "8", "9", "10", "11+"],
  dogPower: ["0", "1", "2", "3", "4+"],
  timeframe: [
    "Oct 18-21",
    "Oct 25-28",
    "Nov 1-4",
    "Nov 8-11",
    "Nov 15-18",
    "Nov 22-25",
    "Nov 29-Dec 2",
  ],
};

const stateOptions = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "Other",
];

type FormState = {
  huntType: string;
  experience: string;
  minGroupSize: string;
  maxGroupSize: string;
  dogPower: string;
  firstChoice: string;
  secondChoice: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  phone: string;
  additionalComments: string;
  captchaChecked: boolean;
};

type Errors = Partial<Record<keyof FormState, string>>;

function SectionImage({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <div className="relative h-[96px] overflow-hidden rounded-[18px] sm:h-[118px] lg:h-[124px] xl:h-[132px]">
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 280px" />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-[6px] block text-[12px] font-medium leading-[1.2] text-[#2d241b]">{children}</label>;
}

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label>
      <span className="text-[#d25f2d]">*</span>
      {children}
    </Label>
  );
}

function ErrorText({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-[11px] text-[#c44d2b]">{message}</p> : null;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormState>({
    huntType: "",
    experience: "",
    minGroupSize: "",
    maxGroupSize: "",
    dogPower: "",
    firstChoice: "",
    secondChoice: "",
    firstName: "",
    lastName: "",
    email: "",
    state: "",
    phone: "",
    additionalComments: "",
    captchaChecked: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitState, setSubmitState] = useState<"idle" | "success">("idle");

  const availableSecondChoices = useMemo(
    () => selectChoices.timeframe.filter((option) => option !== formData.firstChoice),
    [formData.firstChoice],
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target;
    const checked = type === "checkbox" ? (event.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => {
      const nextValue = type === "checkbox" ? checked ?? false : value;
      const nextState = { ...prev, [name]: nextValue } as FormState;

      if (name === "firstChoice" && nextState.firstChoice === nextState.secondChoice) {
        nextState.secondChoice = "";
      }

      if (name === "minGroupSize" && nextState.maxGroupSize) {
        const min = Number(nextState.minGroupSize.replace(/\D/g, ""));
        const max = Number(nextState.maxGroupSize.replace(/\D/g, ""));
        if (min && max && max < min) {
          nextState.maxGroupSize = "";
        }
      }

      return nextState;
    });

    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitState("idle");
  };

  const validate = () => {
    const nextErrors: Errors = {};

    if (!formData.huntType) nextErrors.huntType = "Please choose a hunt type.";
    if (!formData.experience) nextErrors.experience = "Please choose your experience level.";
    if (!formData.minGroupSize) nextErrors.minGroupSize = "Please choose the minimum group size.";
    if (!formData.maxGroupSize) nextErrors.maxGroupSize = "Please choose the maximum group size.";
    if (!formData.dogPower) nextErrors.dogPower = "Please choose how many dogs you plan to bring.";
    if (!formData.firstChoice) nextErrors.firstChoice = "Please select your first preferred week.";
    if (!formData.secondChoice) nextErrors.secondChoice = "Please select your second preferred week.";
    if (!formData.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!formData.state) nextErrors.state = "Please select your state/province.";
    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (!/^[0-9+()\-\s]{7,}$/.test(formData.phone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (formData.minGroupSize && formData.maxGroupSize) {
      const min = Number(formData.minGroupSize.replace(/\D/g, ""));
      const max = Number(formData.maxGroupSize.replace(/\D/g, ""));
      if (min && max && max < min) {
        nextErrors.maxGroupSize = "Max hunters cannot be less than min hunters.";
      }
    }

    if (!formData.captchaChecked) {
      nextErrors.captchaChecked = "Please verify the captcha confirmation.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitState("success");
    console.log("Contact form submitted", formData);
  };

  return (
    <main className="flex flex-col bg-[#ddd1c5] text-[#281703]">
      <section className="relative isolate flex min-h-[430px] items-center justify-center overflow-hidden bg-[#c39c74] sm:min-h-[520px] lg:min-h-[560px] xl:min-h-[590px]">
        <div className="absolute inset-0">
          <Image
            src={pic2}
            alt="UGUIDE contact hero"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-[#f0c38f]/52" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(129,73,26,0.18)_100%)]" />

        <div className="relative z-10 flex w-full flex-col items-center px-5 pt-20 text-center sm:px-6 sm:pt-24 lg:pt-28">
          <h1 className="text-[42px] font-black uppercase leading-none tracking-[-0.03em] text-[#1f1204] sm:text-[58px] md:text-[72px] lg:text-[78px]">
            Contact
          </h1>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2a1807] sm:gap-3">
            <Link href="/" className="inline-flex items-center gap-2 transition-colors hover:text-[#f16724]">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3.172 3 10.2V21h6v-6h6v6h6V10.2l-9-7.028Z" />
              </svg>
              <span>Home</span>
            </Link>
            <span>›</span>
            <span>Contact</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2">
          <div className="h-14 w-full rounded-t-[100%] border-t-[4px] border-[#2b1705] bg-[#dfd3c8] sm:h-16 md:h-20" />
        </div>
      </section>

      <section className="bg-[#dfd3c8] px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 xl:px-10">
        <div className="mx-auto max-w-[1220px] rounded-[18px] bg-[#f5f5f5] shadow-[0_10px_35px_rgba(69,42,13,0.16)]">
          <div className="overflow-hidden rounded-t-[18px] bg-[linear-gradient(180deg,#6f3f08_0%,#3d1d00_100%)] px-4 py-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-[24px] font-black uppercase tracking-[-0.03em] text-white sm:text-[30px] md:text-[36px]">
              Contact Us / Request Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} noValidate className="px-4 pb-8 pt-3 sm:px-6 sm:pb-10 lg:px-8 lg:pb-12">
            <div className="border-b border-[#d3d3d3] py-6 sm:py-8">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[minmax(0,1fr)_290px] xl:gap-8">
                <div>
                  <h3 className="text-[24px] font-black uppercase tracking-[-0.03em] text-[#231506] sm:text-[28px]">1. Hunt</h3>
                  <p className="mt-3 text-[13px] leading-6 text-[#352b24]">
                    <span className="text-[#d25f2d]">*</span>Are you looking for a self or fully guided hunt?
                  </p>
                  <div className="mt-2 space-y-2 text-[13px] text-[#433328]">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="huntType"
                        value="Self-Guided"
                        checked={formData.huntType === "Self-Guided"}
                        onChange={handleChange}
                        className="h-4 w-4 accent-[#ba611c]"
                      />
                      <span>Self-Guided</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="huntType"
                        value="Fully Guided (Professional Guide + Trained Dogs)"
                        checked={formData.huntType === "Fully Guided (Professional Guide + Trained Dogs)"}
                        onChange={handleChange}
                        className="h-4 w-4 accent-[#ba611c]"
                      />
                      <span>Fully Guided (Professional Guide + Trained Dogs)</span>
                    </label>
                  </div>
                  <ErrorText message={errors.huntType} />
                </div>
                <SectionImage src={pic1} alt="Hunter aiming during pheasant hunt" />
              </div>
            </div>

            <div className="border-b border-[#d3d3d3] py-6 sm:py-8">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[minmax(0,1fr)_290px] xl:gap-8">
                <div className="max-w-[560px]">
                  <h3 className="text-[24px] font-black uppercase tracking-[-0.03em] text-[#231506] sm:text-[28px]">2. Experience</h3>
                  <p className="mt-3 text-[13px] leading-6 text-[#352b24]">
                    <span className="text-[#d25f2d]">*</span>How many years have you hunted South Dakota?
                  </p>
                  <select name="experience" value={formData.experience} onChange={handleChange} className={`${fieldClassName} mt-2 max-w-[208px]`}>
                    <option value="">Select</option>
                    {selectChoices.experience.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ErrorText message={errors.experience} />
                </div>
                <SectionImage src={pic2} alt="Pheasant hunting experience section image" />
              </div>
            </div>

            <div className="border-b border-[#d3d3d3] py-6 sm:py-8">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[minmax(0,1fr)_290px] xl:gap-8">
                <div>
                  <h3 className="text-[24px] font-black uppercase tracking-[-0.03em] text-[#231506] sm:text-[28px]">3. Group Info</h3>
                  <p className="mt-2 text-[13px] italic leading-6 text-[#352b24]">
                    Please note the minimum group size is anywhere from 6 to 10 hunters per group.
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-[1fr_140px] md:items-center md:gap-x-4 md:gap-y-3 lg:max-w-[680px]">
                    <p className="text-[13px] leading-6 text-[#352b24]">
                      <span className="text-[#d25f2d]">*</span>What would be the least number of hunters in your group?
                    </p>
                    <div>
                      <select name="minGroupSize" value={formData.minGroupSize} onChange={handleChange} className={fieldClassName}>
                        <option value="">Choose</option>
                        {selectChoices.minGroupSize.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ErrorText message={errors.minGroupSize} />
                    </div>

                    <p className="text-[13px] leading-6 text-[#352b24]">
                      <span className="text-[#d25f2d]">*</span>What would be the most number of hunters in your group?
                    </p>
                    <div>
                      <select name="maxGroupSize" value={formData.maxGroupSize} onChange={handleChange} className={fieldClassName}>
                        <option value="">Choose</option>
                        {selectChoices.maxGroupSize.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ErrorText message={errors.maxGroupSize} />
                    </div>
                  </div>
                </div>
                <SectionImage src={pic3} alt="Group of hunters in orange gear" />
              </div>
            </div>

            <div className="border-b border-[#d3d3d3] py-6 sm:py-8">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[minmax(0,1fr)_290px] xl:gap-8">
                <div className="max-w-[560px]">
                  <h3 className="text-[24px] font-black uppercase tracking-[-0.03em] text-[#231506] sm:text-[28px]">4. Dog Power</h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_150px] md:items-center md:gap-4">
                    <p className="text-[13px] leading-6 text-[#352b24]">
                      <span className="text-[#d25f2d]">*</span>How many dogs do you plan to bring?
                    </p>
                    <div>
                      <select name="dogPower" value={formData.dogPower} onChange={handleChange} className={fieldClassName}>
                        <option value="">Choose</option>
                        {selectChoices.dogPower.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ErrorText message={errors.dogPower} />
                    </div>
                  </div>
                </div>
                <SectionImage src={pic4} alt="Hunters with dogs seated in field" />
              </div>
            </div>

            <div className="border-b border-[#d3d3d3] py-6 sm:py-8">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[minmax(0,1fr)_290px] xl:gap-8">
                <div>
                  <h3 className="text-[21px] font-black uppercase tracking-[-0.03em] text-[#231506] sm:text-[25px] lg:text-[28px]">
                    5. Hunting Timeframe Preferences
                  </h3>
                  <p className="mt-3 text-[13px] leading-6 text-[#352b24]">Please select your preferred weeks.</p>
                  <div className="mt-4 space-y-3 lg:max-w-[420px]">
                    <div className="grid gap-2 sm:grid-cols-[86px_minmax(0,1fr)_72px] sm:items-center">
                      <label htmlFor="firstChoice" className="text-[13px] font-medium text-[#352b24]">1st Choice</label>
                      <div>
                        <select id="firstChoice" name="firstChoice" value={formData.firstChoice} onChange={handleChange} className={fieldClassName}>
                          <option value="">Choose</option>
                          {selectChoices.timeframe.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <ErrorText message={errors.firstChoice} />
                      </div>
                      <Link href="/availability" className="text-[11px] font-medium text-[#e3782f] underline-offset-2 hover:underline">
                        View Grid
                      </Link>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-[86px_minmax(0,1fr)_72px] sm:items-center">
                      <label htmlFor="secondChoice" className="text-[13px] font-medium text-[#352b24]">2nd Choice</label>
                      <div>
                        <select id="secondChoice" name="secondChoice" value={formData.secondChoice} onChange={handleChange} className={fieldClassName}>
                          <option value="">Choose</option>
                          {availableSecondChoices.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <ErrorText message={errors.secondChoice} />
                      </div>
                      <Link href="/availability" className="text-[11px] font-medium text-[#e3782f] underline-offset-2 hover:underline">
                        View Grid
                      </Link>
                    </div>
                  </div>
                </div>
                <SectionImage src={pic5} alt="Calendar and orange accent block" />
              </div>
            </div>

            <div className="py-6 sm:py-8">
              <h3 className="text-[21px] font-black uppercase tracking-[-0.03em] text-[#231506] sm:text-[25px] lg:text-[28px]">6. Contact Info</h3>
              <p className="mt-3 max-w-[760px] text-[13px] leading-6 text-[#352b24]">
                By putting your contact information here, you will be receiving a response within 24 hours via email or phone call from Chris UGUIDE Founder/Owner.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <RequiredLabel>First Name</RequiredLabel>
                  <input name="firstName" value={formData.firstName} onChange={handleChange} className={fieldClassName} autoComplete="given-name" />
                  <ErrorText message={errors.firstName} />
                </div>
                <div>
                  <RequiredLabel>Last Name</RequiredLabel>
                  <input name="lastName" value={formData.lastName} onChange={handleChange} className={fieldClassName} autoComplete="family-name" />
                  <ErrorText message={errors.lastName} />
                </div>
                <div>
                  <RequiredLabel>Email</RequiredLabel>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={fieldClassName} autoComplete="email" />
                  <ErrorText message={errors.email} />
                </div>

                <div>
                  <RequiredLabel>State/Province</RequiredLabel>
                  <select name="state" value={formData.state} onChange={handleChange} className={fieldClassName}>
                    <option value="">Choose</option>
                    {stateOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ErrorText message={errors.state} />
                </div>
                <div>
                  <Label>Phone (Cell Preferred)</Label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={fieldClassName} autoComplete="tel" />
                  <ErrorText message={errors.phone} />
                </div>
              </div>

              <div className="mt-4 max-w-[700px]">
                <Label>Additional Comments</Label>
                <textarea
                  name="additionalComments"
                  value={formData.additionalComments}
                  onChange={handleChange}
                  className={textareaClassName}
                />
              </div>

              <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_220px] md:items-end lg:grid-cols-[280px_220px] lg:justify-between">
                <div>
                  <p className="mb-2 text-[12px] font-medium text-[#2d241b]">
                    <span className="text-[#d25f2d]">*</span>reCAPTCHA
                  </p>
                  <label className="flex min-h-[78px] items-center gap-3 rounded-[2px] border border-[#2a2a2a] bg-[#252525] px-4 py-3 text-white">
                    <input
                      type="checkbox"
                      name="captchaChecked"
                      checked={formData.captchaChecked}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#f16724]"
                    />
                    <span className="text-[12px] leading-5">I&apos;m not a robot</span>
                  </label>
                  <ErrorText message={errors.captchaChecked} />
                </div>

                <button
                  type="submit"
                  className="h-[46px] rounded-[2px] bg-[linear-gradient(180deg,#ff8c3f_0%,#f16724_100%)] px-6 text-[16px] font-black uppercase tracking-[0.04em] text-white shadow-[0_6px_14px_rgba(241,103,36,0.35)] transition hover:brightness-[1.03] focus:outline-none focus:ring-2 focus:ring-[#f16724]/40"
                >
                  Submit Form
                </button>
              </div>

              {submitState === "success" && (
                <div className="mt-5 rounded-[8px] border border-[#c9ddb7] bg-[#f3faea] px-4 py-3 text-[13px] text-[#406127]">
                  Your request information has been captured successfully.
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
