import { Mail, User, Phone } from "lucide-react";
import Banner from "../components/home/Banner";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

const Contacts = () => {
  return (
    <>
      <Banner />
      <Navbar />
      <section className="bg-white py-24 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">

        {/* Badge */}
        <div className="inline-block mb-6 px-6 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
          Contact
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Reach out to us
        </h2>

        {/* Subtext */}
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Ready to grow your brand? Let's connect and build something exceptional together.
        </p>

        {/* Contact Number + Call Button */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <p className="text-gray-800 font-medium">
            Contact Number: <span className="text-green-600">8374517704</span>
          </p>

          <a
            href="tel:8374517704"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-medium transition"
          >
            <Phone className="size-4" />
            Call Now
          </a>
        </div>

        {/* Form */}
        <form className="space-y-8 text-left">

          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Your name
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:border-green-600">
                <User className="text-gray-400 size-5" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full outline-none bg-transparent text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Email id
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:border-green-600">
                <Mail className="text-gray-400 size-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full outline-none bg-transparent text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Message
            </label>
            <textarea
              rows={6}
              placeholder="Enter your message"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 resize-none text-gray-900"
            />
          </div>

          {/* Submit */}
          <div className="text-left">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium transition"
            >
              Submit →
            </button>
          </div>

        </form>
      </div>
      </section>
      <Footer />
    </>
  );
};

export default Contacts;
