import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import User from './pages/User';
import NoMatch from './pages/NotMatch';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/user/:id' element={<User />} />
        <Route path='*' element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
