import { Navbar } from "@/components";
import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <section className="bg-[#232323] w-full p-12 flex flex-col">
        <img
          src="/salinstudio-logo.svg"
          alt="Salin Studio"
          className="w-[200px] self-start"
        />
        <div className="w-[600px] text-white self-center flex flex-col">
          <Navbar />
        </div>
      </section>
      <div className="flex-1 flex justify-center items-center">
        <section className="flex items-start justify-between h-full max-w-[1200px] my-0 mx-auto gap-12 flex-1">
          <div className="flex-1 text-center">
            <h1 className="font-sans text-[32px] text-white">Contact me</h1>
          </div>
          <form
            action=""
            className="flex flex-col gap-3 bg-[#3A3A3A] text-white px-6 py-6 pb-12 flex-1 max-w-[600px] text-sans text-[18px] rounded"
          >
            <input
              type="text"
              className="bg-transparent border-b border-white py-2 outline-none"
              placeholder="Name"
            />
            <input
              type="text"
              className="bg-transparent border-b border-white py-2 outline-none"
              placeholder="Email"
            />
            <textarea
              className="bg-transparent border-b border-white resize-none py-2 outline-none"
              placeholder="Your message"
            />
            <button className="bg-[#d9d9d9] text-black px-5 py-2 font-sans text-[20px] mt-5 border hover:bg-transparent hover:text-[#d9d9d9] hover:border-[#d9d9d9] transition-all">
              Send
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;
