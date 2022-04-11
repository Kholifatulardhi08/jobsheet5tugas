import React, { useContext, createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
  Outlet
} from "react-router-dom";
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
function Main() {
  return (
    <ProvideAuth>
      <Router>
        <div className="body">
          <AuthButton />
          <div>
          <h1>Simple SPA</h1>
          <ul className="header">
            <li><Link to="/public">Home</Link></li>
            <li><Link to="/protected">Out</Link></li>
          </ul>
        </div>
          <Routes>
            <Route path="/public" element={<PublicPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route element={<PrivateRoute/>}>
              <Route path="/protected" element={<ProtectedPage/>}/>
            </Route>
          </Routes>
        </div>
      </Router>
    </ProvideAuth>
  );
}

const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const authContext = createContext();

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = cb => {
    return fakeAuth.signin(() => {
      setUser("user");
      cb();
    });
  };

  const signout = cb => {
    return fakeAuth.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout
  };
}

function AuthButton() {
  let navigate = useNavigate();
  let auth = useAuth();

  return auth.user ? (
    <p className="welcome">
      Welcome!{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
       className="button">
        Sign out
      </button>
    </p>
    
  ) : (
    <br className="welcome"></br>
  );
}

function PrivateRoute({ children, ...rest}){
  let auth = useAuth();
  return auth.user ? <Outlet /> : <Navigate to="/login" />;
}

function PublicPage() {
  return <h1 className="welcome">HELLO, selamat datang di halaman Home!</h1>
}

function ProtectedPage() {
  return(
    <h1 className="welcome">Protected</h1>
  );
}

function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/protected" } };
  let login = () => {
    auth.signin(() => {
      navigate("/", {replace: true});
    });
  };

  return (
    <div className="login">
      <p className="welcome">Harus login terlebih dahulu untuk kehalaman lanjutnya{from.pathname}</p>
      <button className="button-2" onClick={login}>Log in</button>
    </div>
  );
}

export default Main;