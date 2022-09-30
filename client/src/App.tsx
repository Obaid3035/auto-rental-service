import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import {Slide, ToastContainer} from "react-toastify";
import {routes, RoutesLink} from "./component/NavBar/routes";
import NavBar from "./component/NavBar/NavBar";
import './App.css';
import NotFound from "./container/404/404";
import Auth from "./container/Auth/Auth";
import ProtectedRoute from "./lib/ProtectedRoutes";


function App() {


  return (
      <div className="App">
          <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              transition={Slide}
              pauseOnFocusLoss
              draggable
              pauseOnHover
          />
          <Router>
              <Routes>
                  {
                      routes.map((item: RoutesLink, index) => (
                          <Route key={index} path={item.path} element={
                              <React.Fragment>
                                  <NavBar />
                                  <ProtectedRoute>
                                      { item.component }
                                  </ProtectedRoute>
                              </React.Fragment>
                          } />
                      ))
                  }
                  <Route path={'/auth'} element={<Auth />} />
                  <Route path={'*'} element={<NotFound />}/>
              </Routes>
          </Router>
      </div>
  );

}

export default App;
