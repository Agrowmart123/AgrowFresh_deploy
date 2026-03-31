import React, { useState } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import emailjs from "@emailjs/browser";

export default function JoinOurTeam() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    resume: "",
  });

 const uploadResumeAndGetLink = async (file) => {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", "ml_default"); // demo preset

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/demo/auto/upload",
    {
      method: "POST",
      body: form,
    }
  );

  const data = await res.json();
  return data.secure_url;
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume) {
      toast.error("Please upload your resume");
      return;
    }

    try {
      
     const templateParams = {
  name: formData.name,
  email: formData.email,
  phone: formData.phone,
  subject: formData.subject,
  message: formData.message,
 resume: formData.resume
};

      await emailjs.send(
        "service_5y7y3q8",
        "template_39keykc",
        templateParams,
        "7oWN1_-h1G1Z7jW5y"
      );

      toast.success("Application submitted successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        resume: null,
      });

      e.target.reset();

    } catch (error) {
      console.log(error);
      toast.error("Failed to send application");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl"
      >
        <h1 className="text-3xl text-center mb-2">Join Our Team</h1>
        <p className="text-gray-500 text-center mb-6">
          Fill details and upload your resume
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-700">Full Name *</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e)=>setFormData({...formData,name:e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email *</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e)=>setFormData({...formData,email:e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              maxLength={10}
              value={formData.phone}
              onChange={(e)=>setFormData({...formData,phone:e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Upload Resume *</label>
           <input
  required
  type="text"
  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2"
  placeholder="Paste Resume Upload Link"
  value={formData.resume}
  onChange={(e)=>setFormData({...formData,resume:e.target.value})}
/>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Subject *</label>
            <input
              required
              type="text"
              value={formData.subject}
              onChange={(e)=>setFormData({...formData,subject:e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2"
              placeholder="Job role"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Message *</label>
            <textarea
              required
              value={formData.message}
              onChange={(e)=>setFormData({...formData,message:e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2 min-h-[120px]"
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-[#68911a] hover:bg-[#5c7f16] text-white px-8 py-2 rounded-lg transition"
            >
              Submit Application
            </button>
          </div>

        </form>
      </motion.div>

      <Toaster position="top-center" richColors />
    </div>
  );
}