import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import ErrorPage from './components/ErrorPage';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Terms from './components/Terms';
import Register from './components/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChangePassword from './components/ChangePassword';
import Quizzes from './components/Quizzes';
import QuizDetails from './components/QuizDetails';
import QuizSession from './components/QuizSession';
import QuizResult from './components/QuizResult';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';


function App() {
  return (
      <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quiz/:quizId" element={<QuizDetails />} />
            <Route path="/quiz/:quizId/session" element={<QuizSession />} />
            <Route path="/quiz/:quizId/result" element={<QuizResult />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
      </>
  );
}

export default App;
