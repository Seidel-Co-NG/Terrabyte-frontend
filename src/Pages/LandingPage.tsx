import Navbar from "../components/Landingpage/NavBar";
import Hero from "../components/Landingpage/Hero";
import Features from "../components/Landingpage/Features";
import HowItWorks from "../components/Landingpage/HowItWork";
import OurApp from "../components/Landingpage/OurApp";
import OurGoalsSection from "../components/Landingpage/OurGoals";
import Action from "../components/Landingpage/Action";
import ContactSection from "../components/Landingpage/ContactUs";
import Footer from "../components/Landingpage/Footer";


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