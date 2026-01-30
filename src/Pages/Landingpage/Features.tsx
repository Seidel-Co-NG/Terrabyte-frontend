import {
  ShieldCheck,
  Clock3,
  Zap,
  Wifi,
  Tv2,
  Smartphone,
  Contact,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-snug">
            Trusted Data Platform for{" "}
            <span className="text-brand-primary">Users & Resellers</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Our mission is to simplify your everyday bills — securely, fast, and
            without stress.
          </p>
        </motion.div>

        {/* SERVICES LIST */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {[
            {
              icon: <Wifi />,
              label: "Data Subscription",
              description:
                "Affordable data plans for all networks at lightning speed",
            },
            {
              icon: <Tv2 />,
              label: "Cable TV Payment",
              description: "Recharge your GOtv, DStv, or Startimes instantly",
            },
            {
              icon: <Zap />,
              label: "Electricity Bills",
              description:
                "Pay PHCN, IKEDC, and more with instant confirmation",
            },
            {
              icon: <Smartphone />,
              label: "Airtime Top-up",
              description: "Recharge any number nationwide — anytime, anywhere",
            },
            {
              icon: <UserCheck />,
              label: "Exam Scratch Cards",
              description: "Buy WAEC, NECO, and JAMB cards with ease",
            },
            {
              icon: <Contact />,
              label: "Instant Customer Support",
              description: "Get real-time assistance via chat, call, or email",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
            >
              <div className="p-3 bg-black text-white rounded-full">
                {item.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{item.label}</h4>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* PRIVACY + SPEED + SUPPORT */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-brand-primary-lightest rounded-xl p-6">
            <ShieldCheck className="w-6 h-6 text-brand-primary mb-3" />
            <h5 className="font-semibold text-gray-900 mb-2">Privacy First</h5>
            <p className="text-sm text-gray-600">
              We don’t store your personal details unless you ask us to. Your
              privacy stays intact.
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <Clock3 className="w-6 h-6 text-green-700 mb-3" />
            <h5 className="font-semibold text-gray-900 mb-2">We’re Fast</h5>
            <p className="text-sm text-gray-600">
              Speed matters. Enjoy near-instant transactions for all your
              services.
            </p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-6">
            <Contact className="w-6 h-6 text-yellow-700 mb-3" />
            <h5 className="font-semibold text-gray-900 mb-2">Quick Support</h5>
            <p className="text-sm text-gray-600">
              Our support team is always online to respond, resolve, and guide
              you.
            </p>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center pt-10"
        >
          <p className="text-gray-600 text-lg">
            Enjoy these benefits and more —{" "}
            <span className="text-brand-primary font-semibold">sign up today</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
