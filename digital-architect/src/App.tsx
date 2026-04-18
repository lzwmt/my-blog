/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ArticleDetail } from './pages/ArticleDetail';
import { PostCreator } from './pages/PostCreator';
import { Dashboard } from './pages/Dashboard';
import { Navbar } from './components/layout/Navbar';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-base">
        <Routes>
          {/* Post Creator has a unique header, so we handle it separately */}
          <Route path="/new" element={<PostCreator />} />
          
          <Route path="*" element={
            <>
              <Navbar />
              <div className="pt-14">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/post/:slug" element={<ArticleDetail />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}
