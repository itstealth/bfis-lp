"use client";

import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [errors, setErrors] = useState({
    parentName: "",
    studentName: "",
    email: "",
    phone: "",
    classApplyingFor: "",
  });
  const [touchedFields, setTouchedFields] = useState({});

  const slides = [
    {
      mobile: "/info/admissions/Banner-sm.png",
      desktop: "/info/admissions/Hero-Banner.png",
    },
    {
      mobile: "/info/admissions/hero2-sm.png",
      desktop: "/info/admissions/hero2.png",
    },
  ];

  // Navigation functions
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

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

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name.trim()) return "Name is required";
    if (!nameRegex.test(name)) return "Only letters and spaces allowed";
    if (name.trim().length < 2) return "Name too short (min 2 letters)";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone.trim()) return "Phone number is required";
    if (!phoneRegex.test(phone)) return "Enter valid 10-digit mobile number";
    
    // Check localStorage for duplicate
    if (typeof window !== "undefined") {
      const submittedPhones = JSON.parse(localStorage.getItem("submittedPhones") || "[]");
      if (submittedPhones.includes(phone)) {
        return "This number was already used";
      }
    }
    return "";
  };

  const validateField = (name, value) => {
    switch (name) {
      case "parentName":
      case "studentName":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "phone":
        return validatePhone(value);
      case "classApplyingFor":
        return value ? "" : "Please select a class";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For name fields, prevent non-alphabetic characters
    if ((name === "parentName" || name === "studentName") && value) {
      const filteredValue = value.replace(/[^A-Za-z\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: filteredValue }));
      
      // Validate on change if field was touched
      if (touchedFields[name]) {
        setErrors((prev) => ({ ...prev, [name]: validateField(name, filteredValue) }));
      }
      return;
    }

    // For phone, allow only digits and limit to 10
    if (name === "phone") {
      const filteredValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: filteredValue }));
      
      if (touchedFields[name]) {
        setErrors((prev) => ({ ...prev, [name]: validateField(name, filteredValue) }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change if field was touched
    if (touchedFields[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      newErrors[key] = validateField(key, formData[key]);
    });
    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the errors above",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Combine form data with UTM parameters
      const submissionData = {
        ...formData,
        ...utmParams,
      };

      console.log("📤 Submitting lead with UTM data:", submissionData);

      // API Endpoint Configuration:
      // - Development (Next.js): Uses Next.js API route at /api/submit-lead
      // - Production (PHP): Points to hosted PHP backend at StealthLearn
      // PHP Backend Location: https://stealthlearn.in/bfis-lp/landing/submit-lead.php
      const response = await fetch("https://stealthlearn.in/bfis-lp/landing/submit-lead.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store phone number in localStorage to prevent duplicate submissions
        if (typeof window !== "undefined") {
          const submittedPhones = JSON.parse(localStorage.getItem("submittedPhones") || "[]");
          submittedPhones.push(formData.phone);
          localStorage.setItem("submittedPhones", JSON.stringify(submittedPhones));
        }

        // Build URL with parent and student names for personalization
        const params = new URLSearchParams();
        if (formData.parentName) {
          params.append('parentName', formData.parentName);
        }
        if (formData.studentName) {
          params.append('studentName', formData.studentName);
        }
        
        // Redirect to thank-you.html page (served from public folder)
        // Use query parameters to pass names for personalization
        const thankYouUrl = `/info/admissions/thank-you.html`;
        window.location.href = thankYouUrl;
      } else {
        // Handle server-side validation errors
        if (data.validationErrors) {
          setErrors(data.validationErrors);
          setSubmitStatus({
            type: "error",
            message: "Please check your information",
          });
        } else if (data.field === 'phone') {
          // Handle duplicate phone error specifically
          setErrors((prev) => ({ ...prev, phone: data.error }));
          setSubmitStatus({
            type: "error",
            message: data.error,
          });
        } else {
          setSubmitStatus({
            type: "error",
            message: data.error || "Submission failed. Please try again",
          });
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: "error",
        message: "Connection error. Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="hero"
      className="relative flex items-center overflow-hidden pt-16 sm:pt-0 min-h-screen w-full"
    >
      {/* Background Slider */}
      <div className="absolute inset-0 h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Mobile Background */}
            <div
              className="absolute inset-0 h-full w-full bg-cover bg-[#cfd1d7] bg-center bg-no-repeat md:hidden"
              style={{ backgroundImage: `url(${slide.mobile})` }}
            />
            {/* Desktop Background */}
            <div
              className="hidden md:block absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.desktop})` }}
            />
          </div>
        ))}
      </div>
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-[#cd3b30] w-8 sm:w-10"
                : "bg-black hover:bg-black/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

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
            className="w-full bg-white/95 scale-90 shadow-xl rounded-4xl px-10 pt-8 pb-8 flex flex-col gap-4 min-w-[340px] max-w-[400px]"
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

            <div className="relative">
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Parent's Name"
                className={`px-5 py-3 border rounded-md focus:ring-2 focus:outline-none transition-all text-base w-full ${
                  errors.parentName && touchedFields.parentName
                    ? "border-red-500 focus:ring-red-200"
                    : formData.parentName && !errors.parentName
                    ? "border-green-500 focus:ring-green-200"
                    : "border-[#d7d7dc] focus:ring-[#acf15c]"
                }`}
                required
                disabled={isSubmitting}
              />
              {errors.parentName && touchedFields.parentName && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.parentName}</p>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Student's Name"
                className={`px-5 py-3 border rounded-md focus:ring-2 focus:outline-none transition-all text-base w-full ${
                  errors.studentName && touchedFields.studentName
                    ? "border-red-500 focus:ring-red-200"
                    : formData.studentName && !errors.studentName
                    ? "border-green-500 focus:ring-green-200"
                    : "border-[#d7d7dc] focus:ring-[#acf15c]"
                }`}
                required
                disabled={isSubmitting}
              />
              {errors.studentName && touchedFields.studentName && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.studentName}</p>
              )}
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
                className={`px-5 py-3 border rounded-md focus:ring-2 focus:outline-none transition-all text-base w-full ${
                  errors.email && touchedFields.email
                    ? "border-red-500 focus:ring-red-200"
                    : formData.email && !errors.email
                    ? "border-green-500 focus:ring-green-200"
                    : "border-[#d7d7dc] focus:ring-[#acf15c]"
                }`}
                required
                disabled={isSubmitting}
              />
              {errors.email && touchedFields.email && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.email}</p>
              )}
            </div>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Phone"
                className={`px-5 py-3 border rounded-md focus:ring-2 focus:outline-none transition-all text-base w-full ${
                  errors.phone && touchedFields.phone
                    ? "border-red-500 focus:ring-red-200"
                    : formData.phone && !errors.phone
                    ? "border-green-500 focus:ring-green-200"
                    : "border-[#d7d7dc] focus:ring-[#acf15c]"
                }`}
                required
                disabled={isSubmitting}
              />
              {errors.phone && touchedFields.phone && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.phone}</p>
              )}
            </div>
            <div className="relative">
              <select
                name="classApplyingFor"
                value={formData.classApplyingFor}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`px-5 py-3 border rounded-md focus:ring-2 focus:outline-none transition-all text-base bg-white cursor-pointer w-full ${
                  errors.classApplyingFor && touchedFields.classApplyingFor
                    ? "border-red-500 focus:ring-red-200"
                    : formData.classApplyingFor && !errors.classApplyingFor
                    ? "border-green-500 focus:ring-green-200"
                    : "border-[#d7d7dc] focus:ring-[#acf15c]"
                }`}
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
              {errors.classApplyingFor && touchedFields.classApplyingFor && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.classApplyingFor}</p>
              )}
            </div>
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
