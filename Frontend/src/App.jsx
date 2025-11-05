import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Prediction from "./pages/Prediction";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import AboutUs from "./pages/AboutUs";
import Chat from "./pages/Chat";

export default function App() {
  return (
    <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
        <Footer />
    </BrowserRouter>
  );
}
