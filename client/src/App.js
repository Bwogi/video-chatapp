import { Routes, Route } from 'react-router-dom';
import Home1 from './pages/Home1';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<Home1 />} />
				<Route path='/about' element={<About />} />
				<Route path='/contact' element={<Contact />} />
				<Route path='/profile' element={<Profile />} />
				<Route path='/Settings' element={<Settings />} />
			</Routes>
		</>
	);
}

export default App;
