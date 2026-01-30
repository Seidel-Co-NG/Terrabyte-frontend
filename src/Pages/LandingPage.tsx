import Navbar from "./Landingpage/NavBar";
import Hero from "./Landingpage/Hero";
import Features from "./Landingpage/Features";
import HowItWorks from "./Landingpage/HowItWork";
import OurApp from "./Landingpage/OurApp";
import OurGoalsSection from "./Landingpage/OurGoals";
import Action from "./Landingpage/Action";
import ContactSection from "./Landingpage/ContactUs";
import Footer from "./Landingpage/Footer";


const LandingPage = () => {
    return (
        <div>
            <Navbar/>
            <Hero/>
            <Features/>
            <HowItWorks/>
            <OurApp/>
            <OurGoalsSection/>
            <Action/>
            <ContactSection/>
            <Footer/>
        </div>
    );
};

export default LandingPage