import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App'
import AppPx from './AppPx'

function Routing() {
    return(
        <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/Pixels" element={<AppPx />} />
        </Routes>
      </Router>
    )
}
export default Routing