import Navbar from "./Components/NavBar";
import Hero from "./Components/Hero";
import Features from "./Components/Features";
import HowItWorks from "./Components/HowItWork";
import OurApp from "./Components/OurApp";
import OurGoalsSection from "./Components/OurGoals";
import Action from "./Components/Action";
import ContactSection from "./Components/ContactUs";
import Footer from "./Components/Footer";


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