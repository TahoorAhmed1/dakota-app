"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import huntImg from "@/assets/catalogue1.png";
import groupImg from "@/assets/catalogue2.png";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitState("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(data.message);
        // Reset form
        setFormData({
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
          phone: "",
          additionalComments: "",
        });
      } else {
        setSubmitMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitState("success");
    console.log("Contact form submitted", formData);
  };

  const ErrorText = ({ message }: { message?: string }) =>
    message ? <p className="mt-1 text-[11px] text-[#c44d2b]">{message}</p> : null;

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

          <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            {/* Hunt Type */}
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="block text-lg font-semibold text-[#281703]">1. Hunt</label>
                <select
                  name="huntType"
                  value={formData.huntType}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border border-[#b9773d] rounded-md"
                >
                  <option value="">Are you looking for a self or fully guided hunt?</option>
                  <option value="Self-Guided">Self-Guided</option>
                  <option value="Fully Guided">Fully Guided</option>
                </select>
              </div>
              <div className="flex-1">
                <Image
                  src={huntImg}
                  alt="Hunt Image"
                  className="w-full h-[180px] object-cover rounded-md"
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-lg font-semibold text-[#281703]">2. Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full mt-2 p-3 border border-[#b9773d] rounded-md"
              >
                <option value="">How many years have you hunted South Dakota?</option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3+ Years</option>
              </select>
            </div>

            {/* Group Info */}
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="block text-lg font-semibold text-[#281703]">3. Group Info</label>
                <p className="text-sm text-[#5f5f5f]">Please note the minimum group size is 6-10 hunters per group.</p>
                <div className="mt-2">
                  <label className="block">What would be the least number of hunters in your group?</label>
                  <select
                    name="minGroupSize"
                    value={formData.minGroupSize}
                    onChange={handleChange}
                    className="w-full p-3 border border-[#b9773d] rounded-md"
                  >
                    <option value="">Choose</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
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
                      <label htmlFor="secondChoice" className="text-[13px] font-medium text-[#352b24]">1st Choice</label>
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
              <div className="flex-1">
                <Image
                  src={groupImg}
                  alt="Group Image"
                  className="w-full h-[180px] object-cover rounded-md"
                />
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full py-4 text-lg font-semibold text-white bg-[#F16724] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>

            {submitMessage && (
              <div className={`mt-4 p-4 rounded-md ${submitMessage.includes('Thank you') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
