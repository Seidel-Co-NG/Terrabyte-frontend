import React from 'react';

export default function TermsPrivacy() {
  const [tab, setTab] = React.useState<'terms' | 'privacy'>('terms');

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
    
      <div className="pointer-events-none">
        <div className="absolute -left-16 -top-16 w-72 h-72 rounded-[36px] bg-gradient-to-tr from-blue-500/20 via-blue-400/15 to-transparent blur-3xl transform rotate-12 opacity-80"></div>
        <div className="absolute right-8 top-32 w-60 h-60 rounded-full bg-gradient-to-br from-blue-400/15 to-blue-600/10 blur-2xl opacity-70"></div>
        <div className="absolute left-1/2 top-80 w-80 h-80 rounded-3xl bg-gradient-to-br from-blue-300/10 via-blue-500/8 to-transparent blur-2xl opacity-60 -translate-x-1/2"></div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 filter blur-[0.5px]">
              Terrabyte — Legal Center
            </h1>
            <p className="text-sm text-gray-600 mt-1">Terms of Use & Privacy Policy</p>
          </div>

          <nav className="space-x-2">
            <button 
              onClick={() => setTab('terms')} 
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                tab === 'terms' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Terms & Conditions
            </button>
            <button 
              onClick={() => setTab('privacy')} 
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                tab === 'privacy' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Privacy Policy
            </button>
          </nav>
        </header>

        <section className="grid md:grid-cols-4 gap-6">
          {/* Sidebar (quick nav) */}
          <aside className="md:col-span-1 sticky top-24 hidden md:block">
            <div className="backdrop-blur-md bg-white/80 p-4 rounded-2xl border border-gray-200 shadow-lg">
              <h3 className="text-sm font-semibold mb-3 text-gray-900">Quick jump</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#acceptance" className="hover:text-blue-500 hover:underline transition-colors">Acceptance</a></li>
                <li><a href="#conduct" className="hover:text-blue-500 hover:underline transition-colors">Conduct</a></li>
                <li><a href="#nospam" className="hover:text-blue-500 hover:underline transition-colors">No Spam</a></li>
                <li><a href="#collection" className="hover:text-blue-500 hover:underline transition-colors">Data Collection</a></li>
                <li><a href="#sharing" className="hover:text-blue-500 hover:underline transition-colors">Sharing</a></li>
                <li><a href="#retention" className="hover:text-blue-500 hover:underline transition-colors">Retention</a></li>
              </ul>
            </div>
          </aside>

          {/* Content area */}
          <article className="md:col-span-3 space-y-6">
    
            <div className="backdrop-blur-lg bg-white/90 p-6 rounded-3xl border border-gray-200 shadow-xl">

              {/* Top card header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 filter blur-[0.3px]">
                    {tab === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Clear, separated legal pages for Terrabyte Communication Technology.</p>
                </div>
                <div className="text-xs text-gray-500">Last updated: <strong className="text-blue-600">Aug 10, 2025</strong></div>
              </div>

              {/* CONTENT */}
              {tab === 'terms' ? (
                <div className="prose prose-gray max-w-none space-y-6">

                  <section id="acceptance">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">1. Acceptance of Terms</h3>
                    <p className="text-gray-700 leading-relaxed">
                      These Terms of Use ("TOU") govern your access to and use of services provided by Terrabyte Communication Technology ("Terrabyte", "we", "us", or "our"), including but not limited to data bundles, internet/mobile browsing, airtime/recharge cards, classifieds, forums, and email services (collectively, the "Service"). By using the Service in any way, you accept and agree to these TOU. If you do not agree, discontinue use immediately.
                    </p>
                  </section>

                  <section id="modifications">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">2. Modifications to This Agreement</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We may modify these Terms at our sole discretion. Changes become effective when posted. Please review this agreement regularly — continued use after changes means you accept the updated Terms.
                    </p>
                  </section>

                  <section id="conduct">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">3. User Conduct — Rules & Restrictions</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">When using Terrabyte, you agree not to:</p>
                    <ul className="space-y-2 text-gray-700 list-disc pl-6">
                      <li>Create multiple accounts to circumvent limits; repeated abuse may lead to termination and forfeiture of funds.</li>
                      <li>Contact users who have expressed that they do not wish to be contacted or send unsolicited commercial messages.</li>
                      <li>Stalk, harass, threaten, or otherwise harm others.</li>
                      <li>Collect other users' personal data for unlawful or commercial purposes without consent.</li>
                      <li>Use automated tools (spiders, bots, crawlers) to scrape data unless explicitly permitted.</li>
                      <li>Post irrelevant, repetitive, or non-local content that places an unreasonable load on our systems.</li>
                      <li>Post the same listing in multiple categories or geographic areas.</li>
                      <li>Attempt unauthorized access to Terrabyte systems or interfere with service performance.</li>
                      <li>Use automated posting or flagging tools to post in bulk or manipulate moderation systems.</li>
                    </ul>

                    <p className="mt-4 text-gray-700 leading-relaxed">You also must not post content that:</p>
                    <ul className="space-y-2 text-gray-700 list-disc pl-6">
                      <li>Is unlawful, threatening, abusive, harmful to minors, defamatory, or invasive of privacy.</li>
                      <li>Contains pornographic material or explicit sexual content.</li>
                      <li>Harasses, degrades, or incites hate against protected groups.</li>
                      <li>Violates anti-discrimination or equal employment laws.</li>
                      <li>Impersonates another person or misrepresents affiliation with any entity.</li>
                      <li>Includes personal or identifying information about another person without consent.</li>
                      <li>Is false, misleading, deceptive, or constitutes a bait-and-switch.</li>
                      <li>Infringes intellectual property rights or contains viruses or malware.</li>
                      <li>Contains unsolicited advertising, spam, chain letters, pyramid schemes, or illegal offers.</li>
                      <li>Misuses email headers, forged identifiers, or other techniques to disguise origin.</li>
                    </ul>
                  </section>

                  <section id="nospam">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">4. No Spam Policy</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Sending unsolicited commercial messages using our systems is prohibited. Unauthorized use of Terrabyte systems may violate applicable laws and can lead to civil or criminal penalties.
                    </p>
                  </section>

                  <section id="liability">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">5. Limitation of Liability & Disclaimers</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      To the maximum extent permitted by law, Terrabyte disclaims all warranties, whether express or implied. We are not liable for indirect, incidental, special, consequential or punitive damages arising from your use of the Service. Our total liability for damages will not exceed the amount you paid us in the prior 12 months or one hundred US dollars (USD 100), whichever is greater.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      The Service is provided "as is" and "as available". We do not guarantee uninterrupted or error-free service.
                    </p>
                  </section>

                  <section id="governing">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">6. Governing Law & Dispute Resolution</h3>
                    <p className="text-gray-700 leading-relaxed">
                      These Terms are governed by the laws of Nigeria. Any dispute arising out of these Terms will be resolved in the courts of Nigeria unless otherwise agreed in writing.
                    </p>
                  </section>

                  <section id="contact" className="pt-4">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">7. Contact</h3>
                    <p className="text-gray-700 leading-relaxed">
                      For questions about these Terms, please contact Terrabyte Communication Technology through the contact details on our website.
                    </p>
                  </section>

                </div>
              ) : (
                <div className="prose prose-gray max-w-none space-y-6">

                  <section id="collection">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">1. Information We Collect</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We collect information you provide directly, information collected automatically when you use the Service, and information from third-party sources.
                    </p>

                    <h4 className="text-md font-medium text-gray-800 mb-2">Types of Data</h4>
                    <ul className="space-y-2 text-gray-700 list-disc pl-6">
                      <li><strong>Personal Data:</strong> Information that identifies you (e.g., name, email, phone number, address, KYC/BVN details).</li>
                      <li><strong>Profile Information:</strong> Optional details you add to your account such as photo, job title, or preferences.</li>
                      <li><strong>Payment Information:</strong> Payment details processed by third-party providers (we do not store raw card numbers).</li>
                      <li><strong>Anonymous Data:</strong> Aggregate or de-identified data that cannot reasonably be used to identify you.</li>
                    </ul>

                    <h4 className="text-md font-medium text-gray-800 mb-2 mt-4">Usage & Device Data</h4>
                    <p className="text-gray-700 leading-relaxed">
                      We collect usage information (pages visited, actions taken), log data (IP address, timestamps), device information, crash data, and cookie data to improve the Service and for security.
                    </p>

                    <h4 className="text-md font-medium text-gray-800 mb-2 mt-4">Cookies & Tracking</h4>
                    <p className="text-gray-700 leading-relaxed">
                      We use cookies and similar technologies. You can disable cookies in your browser, but our Services may not fully respond to "Do Not Track" signals due to lack of standardization.
                    </p>
                  </section>

                  <section id="sharing">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">2. How Information Is Shared</h3>

                    <h4 className="text-md font-medium text-gray-800 mb-2">With Your Consent</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      You may authorize sharing when you connect third-party apps or participate in promotions.
                    </p>

                    <h4 className="text-md font-medium text-gray-800 mb-2">Legal & Safety</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We may disclose Personal Data to comply with legal processes, protect our rights, investigate potential violations, or to respond to requests by public authorities.
                    </p>

                    <h4 className="text-md font-medium text-gray-800 mb-2">Service Providers</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Third-party service providers (e.g., payment processors, analytics providers) may have limited access to data to perform services on our behalf. They are contractually required to protect data consistent with this Policy.
                    </p>
                  </section>

                  <section id="retention">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">3. Data Retention</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We retain Personal Data as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce agreements. You may request deletion of your data — however we may retain certain information for fraud prevention, legal compliance, or backups.
                    </p>
                  </section>

                  <section id="thirdparty">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">4. Third-Party Websites</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Links to other websites take you off our Site. We are not responsible for the privacy practices or content on third-party sites.
                    </p>
                  </section>

                  <section id="rights">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">5. Your Rights</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      You can manage email preferences, update account details, request access to or deletion of your Personal Data. We may still send service-related messages even if you opt out of promotional emails.
                    </p>

                    <h4 className="text-md font-medium text-gray-800 mb-2">Email Choices</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Promotional messages include an unsubscribe link. Service messages (such as changes to Terms or Policy) may still be sent.
                    </p>
                  </section>

                  <section id="changes">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">6. Changes to This Privacy Policy</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We may update this Policy occasionally. Material changes will be communicated by email and/or a prominent notice on our Site.
                    </p>
                  </section>

                  <section id="contact-privacy" className="pt-4">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">7. Contact</h3>
                    <p className="text-gray-700 leading-relaxed">
                      For privacy questions, contact Terrabyte Communication Technology via the contact information on our website.
                    </p>
                  </section>

                </div>
              )}

            </div>

            {/* Footer panel with CTA */}
            <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm text-gray-600">Need this exported as PDF or plain text? I can generate that for you.</div>
              <div>
                <button className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-sm">
                  Contact Us
                </button>
              </div>
            </div>

          </article>
        </section>
      </main>

      {/* subtle gradient at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-gray-100/80 to-transparent pointer-events-none"></div>
    </div>
  );
}