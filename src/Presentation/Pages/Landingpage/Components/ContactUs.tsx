import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 bg-white dark:bg-bg-primary mt-8 sm:mt-12 lg:mt-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
        {/* Left Content */}
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-text-primary mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-text-secondary text-sm sm:text-base mb-6 sm:mb-10">
            We'd love to hear from you. Whether it's a question, suggestion, or
            support — reach out and our team will respond quickly.
          </p>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <MapPin className="text-brand-primary w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-text-primary">Our Address</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-text-secondary">Ogun State, Nigeria</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <Mail className="text-brand-primary w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-text-primary">Email Us</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-text-secondary">info@terrabyte.com.ng</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <Phone className="text-brand-primary w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-text-primary">Call Us</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-text-secondary">+234 7049780419</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md rounded-2xl bg-brand-primary-lightest dark:bg-bg-card p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-brand-primary mb-4">
              Send us a Message
            </h3>
            <form className="space-y-3 sm:space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-border-color bg-white dark:bg-bg-input text-gray-900 dark:text-text-primary placeholder-gray-500 dark:placeholder-text-muted text-sm outline-none focus:ring-2 focus:ring-brand-primary-lighter dark:focus:ring-brand-primary"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-border-color bg-white dark:bg-bg-input text-gray-900 dark:text-text-primary placeholder-gray-500 dark:placeholder-text-muted text-sm outline-none focus:ring-2 focus:ring-brand-primary-lighter dark:focus:ring-brand-primary"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-border-color bg-white dark:bg-bg-input text-gray-900 dark:text-text-primary placeholder-gray-500 dark:placeholder-text-muted text-sm outline-none focus:ring-2 focus:ring-brand-primary-lighter dark:focus:ring-brand-primary resize-none"
              />
              <button
                type="submit"
                className="w-full bg-brand-primary text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-brand-primary-dark transition"
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
