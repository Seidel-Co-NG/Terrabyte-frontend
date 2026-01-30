import { Target, Eye, HeartHandshake, Globe, Sparkles, CheckCircle2 } from "lucide-react";

export default function OurGoalsSection() {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">OUR GOALS</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Bringing a comfortable life to our users through exceptional service.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Goal */}
        <div className="border-l-4 border-brand-primary pl-4">
          <div className="flex items-center mb-2">
            <Globe className="text-brand-primary w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Our Goal</h3>
          </div>
          <p className="text-sm text-gray-600">
            Bringing comfort to all users by ensuring seamless access to data, airtime,
            and other digital services — right from your home or office.
          </p>
        </div>

        {/* Mission */}
        <div className="border-l-4 border-purple-600 pl-4">
          <div className="flex items-center mb-2">
            <Target className="text-purple-600 w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Our Mission</h3>
          </div>
          <p className="text-sm text-gray-600">
            To be a top-tier service provider in the telecom industry, offering unmatched value to every Nigerian user.
          </p>
        </div>

        {/* Vision */}
        <div className="border-l-4 border-green-600 pl-4">
          <div className="flex items-center mb-2">
            <Eye className="text-green-600 w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Our Vision</h3>
          </div>
          <p className="text-sm text-gray-600">
            Expand efficiently to simplify digital technology for every partner and customer — powered by faith and passion.
          </p>
        </div>

        {/* Beliefs */}
        <div className="border-l-4 border-pink-600 pl-4">
          <div className="flex items-center mb-2">
            <HeartHandshake className="text-pink-600 w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Our Beliefs</h3>
          </div>
          <p className="text-sm text-gray-600">
            At <strong>TERRABYTE</strong>, it’s customers first. We believe in affordable, stress-free service delivery.
          </p>
        </div>

        {/* Core Values */}
        <div className="border-l-4 border-yellow-500 pl-4">
          <div className="flex items-center mb-2">
            <Sparkles className="text-yellow-500 w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Our Core Values</h3>
          </div>
          <p className="text-sm text-gray-600">
            Trust. Excellence. Speed. Transparency. These values guide every click, every recharge, every connection.
          </p>
        </div>

        {/* Promise */}
        <div className="border-l-4 border-red-500 pl-4">
          <div className="flex items-center mb-2">
            <CheckCircle2 className="text-red-500 w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Our Promise</h3>
          </div>
          <p className="text-sm text-gray-600">
            You'll never feel lost. Our support, platform, and performance are all here to serve you, 24/7.
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}

