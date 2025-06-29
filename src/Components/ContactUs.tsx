import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="px-6 lg:px-20 py-16 sm:py-20 lg:py-24 bg-white mt-8 sm:mt-12 lg:mt-16">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        {/* Left Content */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 text-base mb-10">
            We'd love to hear from you. Whether it’s a question, suggestion, or
            support — reach out and our team will respond quickly.
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <MapPin className="text-blue-900 w-6 h-6 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800">Our Address</h4>
                <p className="text-sm text-gray-600">Ogun State, Nigeria</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="text-blue-900 w-6 h-6 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800">Email Us</h4>
                <p className="text-sm text-gray-600">info@terrabyte.com.ng</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="text-blue-900 w-6 h-6 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800">Call Us</h4>
                <p className="text-sm text-gray-600">+234 7049780419</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md rounded-2xl bg-blue-50 p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              Send us a Message
            </h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
