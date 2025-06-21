import Features from "../../Components/Features";
import Hero from "../../Components/Hero";
import HowItWorks from "../../Components/HowItWork";
import Navbar from "../../Components/NavBar";
import OurApp from "../../Components/OurApp";
import OurGoalsSection from "../../Components/OurGoals";
import Action from "../../Components/Action";
import ContactSection from "../../Components/ContactUs";
import Footer from "../../Components/Footer";


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