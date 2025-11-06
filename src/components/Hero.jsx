"use client";

import { CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function Hero() {
  const [formData, setFormData] = useState({
    parentName: "",
    studentName: "",
    email: "",
    phone: "",
    classApplyingFor: "",
  });
  const [utmParams, setUtmParams] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Capture UTM parameters from URL on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      
      const capturedUtmParams = {
        utm_source: urlParams.get("utm_source") || "",
        utm_medium: urlParams.get("utm_medium") || "",
        utm_campaign: urlParams.get("utm_campaign") || "",
        utm_term: urlParams.get("utm_term") || "",
        utm_content: urlParams.get("utm_content") || "",
      };

      // Only update if at least one UTM parameter exists
      if (Object.values(capturedUtmParams).some(value => value !== "")) {
        setUtmParams(capturedUtmParams);
        console.log("📊 UTM Parameters captured:", capturedUtmParams);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Combine form data with UTM parameters
      const submissionData = {
        ...formData,
        ...utmParams,
      };

      console.log("📤 Submitting lead with UTM data:", submissionData);

      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your enquiry has been submitted successfully.",
        });
        // Reset form
        setFormData({
          parentName: "",
          studentName: "",
          email: "",
          phone: "",
          classApplyingFor: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to submit form. Please try again.",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="hero" className="relative pt-16 sm:pt-0 min-h-screen w-full overflow-hidden flex items-center">
      {/* Mobile Background (below md) */}
      <div
        className="absolute inset-0 bg-cover bg-[#cfd1d7] bg-no-repeat bg-center md:hidden"
        style={{ backgroundImage: "url(/Banner-sm.png)" }}
      />
      {/* Desktop Background (md and above) */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: "url(/Hero-Banner.png)" }}
      />
      {/* Main Content Grid */}
      <div
        className="relative w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between pl-4 lg:pl-12 py-8 lg:py-0 z-10"
        style={{ fontFamily: "var(--font-roboto-slab), sans-serif" }}
      >
        {/* LEFT: Logo and Text */}
        <div className="flex-1 flex flex-col md:mt-20 items-center sm:items-start max-w-[610px]">
          {/* Headline */}
          <h1 className="text-3xl opacity-0 text-center sm:text-left sm:text-4xl font-extrabold text-black leading-[1.08] mb-4 drop-shadow-xl capitalize">
            Give your child <br className="hidden sm:inline" />
            Best Learning Experience
          </h1>
          {/* Sub-headline Banner */}
          <div className="mb-6 opacity-0 inline-flex flex-col gap-2 text-center sm:text-left bg-[#acf15c] pl-3 pr-7 mr-5 sm:mr-0 py-1.5 text-black text-[21px] sm:text-[28px] font-semibold drop-shadow-sm tracking-wider">
            <span className="">
              Admissions Open for 2026-27
            </span>
            <span className="text-black font-extrabold text-3xl">
              Pre-Nursery to Grade XII
            </span>
          </div>

          {/* Admissions Badge */}
          {/* <div className="flex flex-col gap-3 mb-6">
            <div className="">
              <span className="text-green-600 font-extrabold text-3xl">
                Pre-Nursery to Grade XII
              </span>
            </div>
          </div> */}

          {/* Bullet List */}
          {/* <ul className="space-y-3 text-lg sm:text-3xl text-white font-semibold mb-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />A CBSE school with
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              World-class infrastructure
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              legacy of personalized learning
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              99% results
            </li>
          </ul> */}
        </div>

        {/* RIGHT: Enquiry Form */}
        <div className="flex-1 flex justify-center items-center w-full max-w-md lg:pl-8 mt-24 sm:mt-0">
          <form
            onSubmit={handleSubmit}
            className="w-full bg-white/95 scale-90 shadow-xl rounded-[2rem] px-10 pt-8 pb-8 flex flex-col gap-4 min-w-[340px] max-w-[400px]"
            style={{ boxShadow: "0 4px 32px 0 rgba(28,31,39,0.13)" }}
          >
            <h3 className="text-xl font-medium text-center text-[#18181b]">
              Admissions Open for 2026
            </h3>
            <h4 className="text-xl font-medium text-center text-[#18181b] mb-2">
              Pre-Nursery - Grade XII
            </h4>

            {/* Status Messages */}
            {submitStatus && (
              <div
                className={`px-4 py-3 rounded-md text-sm ${
                  submitStatus.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              placeholder="Parent's Name"
              className="px-5 py-3 border border-[#d7d7dc] rounded-md focus:ring-2 focus:ring-[#acf15c] focus:outline-none transition text-base"
              required
              disabled={isSubmitting}
            />
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Student's Name"
              className="px-5 py-3 border border-[#d7d7dc] rounded-md focus:ring-2 focus:ring-[#acf15c] focus:outline-none transition text-base"
              required
              disabled={isSubmitting}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="px-5 py-3 border border-[#d7d7dc] rounded-md focus:ring-2 focus:ring-[#acf15c] focus:outline-none transition text-base"
              required
              disabled={isSubmitting}
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="px-5 py-3 border border-[#d7d7dc] rounded-md focus:ring-2 focus:ring-[#acf15c] focus:outline-none transition text-base"
              required
              disabled={isSubmitting}
            />
            <select
              name="classApplyingFor"
              value={formData.classApplyingFor}
              onChange={handleChange}
              className="px-5 py-3 border border-[#d7d7dc] rounded-md focus:ring-2 focus:ring-[#acf15c] focus:outline-none transition text-base bg-white cursor-pointer"
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>
                Class Applying For
              </option>
              <option value="pre-nursery">Pre-Nursery</option>
              <option value="nursery">Nursery</option>
              <option value="lkg">LKG (Lower Kindergarten)</option>
              <option value="ukg">UKG (Upper Kindergarten)</option>
              <option value="grade-i">Grade I</option>
              <option value="grade-ii">Grade II</option>
              <option value="grade-iii">Grade III</option>
              <option value="grade-iv">Grade IV</option>
              <option value="grade-v">Grade V</option>
              <option value="grade-vi">Grade VI</option>
              <option value="grade-vii">Grade VII</option>
              <option value="grade-viii">Grade VIII</option>
              <option value="grade-ix">Grade IX</option>
              <option value="grade-x">Grade X</option>
              <option value="grade-xi">Grade XI</option>
              <option value="grade-xii">Grade XII</option>
            </select>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-md bg-[#acf15c] text-black text-lg font-semibold mt-2 transition ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#abf15cc3]"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
