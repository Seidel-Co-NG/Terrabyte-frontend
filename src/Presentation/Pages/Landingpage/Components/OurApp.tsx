import { ShieldCheck, Clock3, Contact, } from "lucide-react";
import { motion } from "framer-motion";
export default function AboutUsSection() {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-snug">
            About Us
          </h2>
          <p className="mt-4 text-brand-primary font-medium text-base sm:text-lg">
            Trusted Data Platform for Users & Resellers
          </p>
          <p className="mt-4 sm:mt-6 text-gray-600 leading-relaxed text-sm sm:text-base">
            Our services include: <strong>Data subscription</strong>, <strong>Cable subscription</strong>, <strong>Electric bill payments</strong>, <strong>Airtime top-up</strong>, <strong>Examination scratch cards</strong>, etc. These services are designed to work from the comfort of your home or office — no queues, no stress.
          </p>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            We never store your personal details unless you give us permission. Your privacy remains protected. Plus, our support team is always available to help.
          </p>

          {/* Trust Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <div className="bg-brand-primary-lightest rounded-xl p-4 text-center shadow-sm">
              <Clock3 className="mx-auto text-brand-primary mb-2" />
              <h5 className="font-semibold text-gray-800 text-sm">We're Fast</h5>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center shadow-sm">
              <ShieldCheck className="mx-auto text-yellow-700 mb-2" />
              <h5 className="font-semibold text-gray-800 text-sm">Private & Secure</h5>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center shadow-sm">
              <Contact className="mx-auto text-green-700 mb-2" />
              <h5 className="font-semibold text-gray-800 text-sm">Quick Support</h5>
            </div>
          </div>

          <p className="mt-6 text-gray-700 text-sm">
            Enjoy these benefits and more by signing up today.
          </p>
        </motion.div>

        {/* RIGHT PHONE MOCKUPS */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="relative flex flex-col items-center h-auto sm:h-[450px] lg:h-[550px] mt-8 lg:mt-0"
        >
          {/* Glow */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-brand-primary opacity-20 blur-3xl z-0" />

          {/* Phone 1 */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10 translate-y-0 sm:-translate-y-5"
          >
            <div className="w-40 h-[320px] sm:w-48 sm:h-[380px] rounded-[1.8rem] overflow-hidden">
              <img src="/img/terrabyte.jpg" alt="Phone Mockup" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Phone 2 */}
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="absolute right-0 sm:right-[-40px] lg:right-[-60px] bottom-0 sm:bottom-[-10px] z-0 hidden lg:flex"
          >
            <div className="w-40 sm:w-48 h-[320px] sm:h-[380px] rounded-[1.8rem] overflow-hidden">
              <img src="/img/airtime.jpg" alt="Phone Mockup" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* 📊 STATS BLOCK under phones */}
          <div className="mt-8 sm:mt-12 lg:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 z-10">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">2.4k+</div>
              <div className="text-xs sm:text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">500+</div>
              <div className="text-xs sm:text-sm text-gray-600">Clients Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">2.5k+</div>
              <div className="text-xs sm:text-sm text-gray-600">Happy User</div>
            </div>
          </div>
        </motion.div>


      </div>
    </section>
  );
}
