import { CreditCard, Shield, Smartphone, Zap } from "lucide-react";


const HowItWorks = () => {
  const steps = [
    {
      icon: Smartphone,
      title: "Download App",
      description: "Get the Terabyte app from your app store and create your account in minutes"
    },
    {
      icon: Shield,
      title: "Verify Account", 
      description: "Complete your profile verification for secure transactions and full access"
    },
    {
      icon: CreditCard,
      title: "Fund Wallet",
      description: "Add money to your wallet using bank transfer, card payment or other methods"
    },
    {
      icon: Zap,
      title: "Start Transacting",
      description: "Purchase data, pay bills, buy airtime and enjoy seamless digital services"
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Get started with Terrabyte in just 4 simple steps
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index}
                className="text-center relative animate-fade-in"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                {/* Enhanced step number - more prominent */}
                <div className="relative mb-6">
                  {/* <div className="absolute -top-2 -left-2 w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10">
                    {index + 1}
                  </div> */}
                  
                  {/* Icon container */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl shadow-lg items-center justify-center mx-auto hover:shadow-xl transition-shadow flex">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-brand-primary" />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>
                
                {/* Connector line (except for last item) - hidden on small screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-brand-primary to-gray-300 transform -translate-x-1/2 z-0"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
