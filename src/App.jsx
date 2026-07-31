import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Feelings from './pages/Feelings'
import FeelingDetail from './pages/FeelingDetail'
import DailyPrayer from './pages/DailyPrayer'
import SmallSteps from './pages/SmallSteps'
import Stories from './pages/Stories'
import Journal from './pages/Journal'
import PeaceCorner from './pages/PeaceCorner'
import Resources from './pages/Resources'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="feelings" element={<Feelings />} />
          <Route path="feelings/:emotionId" element={<FeelingDetail />} />
          <Route path="daily-prayer" element={<DailyPrayer />} />
          <Route path="small-steps" element={<SmallSteps />} />
          <Route path="stories" element={<Stories />} />
          <Route path="journal" element={<Journal />} />
          <Route path="peace-corner" element={<PeaceCorner />} />
          <Route path="resources" element={<Resources />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
