/*import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navebar";

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordconfo, setPasswordconfo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const signupuser = (event) => {
        event.preventDefault();

        const user = {
            username: name,
            email: email,
            password: password,
            password_confirmation: passwordconfo,
        };
        axios.post('http://127.0.0.1:8000/register/', user)
        .then((Response) => {
            setErrorMessage('');
            navigate('/')
        })
        .catch((error) => {
            if (error.response?.data?.errors) {
                setErrorMessage(Object.values(error.response.data.errors).join(' '));
            } else {
                setErrorMessage('Faild to connect to API');
            }
        });
    };

    return(
        <div>
            <Navbar/>
            <div className="container">
                <div className="row justify-content-center align-items-center" style={{ minHeight: "620px" }}>
                <div className="col-md-6">
                    <div className="border order rounded p-4" >
                        <center><h1>Sign Up</h1></center>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <form onSubmit={signupuser}>
                            <div className="form-group">
                                <input type="text" className="form-control" value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
                            </div>
                            <div className="form-group">
                                <input type="email" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="user@gmail.com" />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" value={passwordconfo} onChange={(event) => setPasswordconfo(event.target.value)} placeholder="Confo_Password" />
                            </div>
                            <div className="form-group text-center">
                                <button className="btn btn-primary form-control" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}
export default Signup;*/
// src/components/Register.js
/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordconfo, setPasswordconfo] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const user = {
        username: username,
        email: email,
        password: password,
        password_confirmation: passwordconfo,
    }

    try {
      await axios.post('http://127.0.0.1:8000/register/', user)
      .then((response) => {
      alert('Registration successful! You can now log in.');
      navigate('/login')
      })
    } catch (error) {
        if (error.response?.data?.errors) {
            setError(Object.values(error.response.data.errors).join(' '));
        } else {
            setError('Faild to connect to API');
        }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        <label style={{ marginBottom: '10px' }}>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </label>
        <label style={{ marginBottom: '10px' }}>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </label>
        <label style={{ marginBottom: '10px' }}>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </label>
        <label style={{ marginBottom: '10px' }}>
          password_confirmation:
          <input type="password" value={passwordconfo} onChange={(e) => setPasswordconfo(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </label>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Register
        </button>
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{success}</p>}
      </form>
    </div>
  );
};

export default Register;*/
/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import './Auth.css';
//import './Auth.css'; // Ensure this path matches your project structu

const Register = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordconfo] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = {
      username: username,
      email: email,
      password: password,
      password_confirmation: password_confirmation,
  }

    const handleSignUp = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/register/', user)
            dispatch(setUser(response.data.user));
            navigate('/');
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/login/', { username, password });
            dispatch(setUser(response.data.user));
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className={`container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
            <div className="row">
                <div className="col align-items-center flex-col sign-up">
                    <div className="form-wrapper align-items-center">
                        <div className="form sign-up">
                            <div className="input-group">
                                <i className="bx bxs-user"></i>
                                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <i className="bx bx-mail-send"></i>
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <i className="bx bxs-lock-alt"></i>
                                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <i className="bx bxs-lock-alt"></i>
                                <input type="password" placeholder="Password" value={password_confirmation} onChange={(e) => setPasswordconfo(e.target.value)} />
                            </div>
                            <button onClick={handleSignUp}>Sign Up</button>
                            <p>
                                <span>Already have an account? </span>
                                <b onClick={() => setIsSignUp(false)} className="pointer">Sign In here</b>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col align-items-center flex-col sign-in">
                    <div className="form-wrapper align-items-center">
                        <div className="form sign-in">
                            <div className="input-group">
                                <i className="bx bx-mail-send"></i>
                                <input type="username" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <i className="bx bxs-lock-alt"></i>
                                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <button onClick={handleLogin}>Sign In</button>
                            <p>
                                <b>Forgot password?</b>
                            </p>
                            <p>
                                <span>Don't have an account? </span>
                                <b onClick={() => setIsSignUp(true)} className="pointer">Sign Up here</b>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;*/
// Import necessary modules and hooks
/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import Navbar from '../navebar';

// Register component definition
const Register = () => {
  // State variables for form inputs and feedback messages
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordconfo, setPasswordconfo] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to handle registration and login
  const handleRegisterAndLogin = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const user = {
        username: username,
        email: email,
        password: password,
        password_confirmation: passwordconfo,
    };

    try {
      // Register the user
      await axios.post('http://127.0.0.1:8000/register/', user);
      alert('Registration successful! Logging you in...');
      
      // Login the user
      const response = await axios.post('http://127.0.0.1:8000/login/', {
        username: username,
        password: password,
      });
      
      // Dispatch user data to Redux store
      const { token, username: name, isAdmin } = response.data;
      const loggedInUser = {
        username: name,
        token,
        isAdmin,
      };
      dispatch(setUser(loggedInUser));
      navigate('/');

    } catch (error) {
        if (error.response?.data?.errors) {
            setError(Object.values(error.response.data.errors).join(' '));
        } else if (error.response?.data?.message) {
            setError(error.response.data.message);
        } else {
            setError('Failed to connect to API');
        }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleRegisterAndLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        <label style={{ marginBottom: '10px' }}>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </label>
        <label style={{ marginBottom: '10px' }}>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </label>
        <label style={{ marginBottom: '10px' }}>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </label>
        <label style={{ marginBottom: '10px' }}>
          password_confirmation:
          <input type="password" value={passwordconfo} onChange={(e) => setPasswordconfo(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </label>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Register
        </button>
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{success}</p>}
      </form>
    </div>
  );
};

export default Register;*/
/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import Navbar from '../navebar';

// Register component definition
const Register = () => {
  // State variables for form inputs and feedback messages
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordconfo, setPasswordconfo] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to handle registration and login
  const handleRegisterAndLogin = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const user = {
        username: username,
        email: email,
        password: password,
        password_confirmation: passwordconfo,
    };

    try {
      // Register the user
      await axios.post('http://127.0.0.1:8000/register/', user);
      alert('Registration successful! Logging you in...');
      
      // Login the user
      const response = await axios.post('http://127.0.0.1:8000/login/', {
        username: username,
        password: password,
      });
      
      // Dispatch user data to Redux store
      const { token, username: name, isAdmin } = response.data;
      const loggedInUser = {
        username: name,
        token,
        isAdmin,
      };
      dispatch(setUser(loggedInUser));
      navigate('/');

    } catch (error) {
        if (error.response?.data?.errors) {
            setError(Object.values(error.response.data.errors).join(' '));
        } else if (error.response?.data?.message) {
            setError(error.response.data.message);
        } else {
            setError('Failed to connect to API');
        }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleRegisterAndLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        <label style={{ marginBottom: '10px' }}>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </label>
        <label style={{ marginBottom: '10px' }}>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </label>
        <label style={{ marginBottom: '10px' }}>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </label>
        <label style={{ marginBottom: '10px' }}>
          Password Confirmation:
          <input type="password" value={passwordconfo} onChange={(e) => setPasswordconfo(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </label>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Register
        </button>
        <Link to="/login" style={{ marginTop: '10px', textAlign: 'center', color: '#4CAF50', textDecoration: 'none' }}>
          Already have an account? Login
        </Link>
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{success}</p>}
      </form>
    </div>
  );
};

export default Register;*/
/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import Navbar from '../navebar';

const Signup = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfo, setPasswordConfo] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAuth = async (event) => {
    event.preventDefault();
    setError(null);

    if (isRegister) {
      if (password !== passwordConfo) {
        setError('Passwords do not match');
        return;
      }
      try {
        await axios.post('http://127.0.0.1:8000/register/', { username, email, password, password_confirmation: passwordConfo });
        alert('Registration successful! Logging you in...');
      } catch (error) {
        if (error.response?.data?.errors) {
          setError(Object.values(error.response.data.errors).join(' '));
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Failed to connect to API');
        }
        return;
      }
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', { username, password });
      const { token, username: name, isAdmin } = response.data;
      const loggedInUser = { username: name, token, isAdmin };
      dispatch(setUser(loggedInUser));
      navigate('/');
    } catch (error) {
      if (error.response?.data?.errors) {
        setError(Object.values(error.response.data.errors).join(' '));
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to login user. Please contact admin');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row justify-content-center align-items-center" style={{ minHeight: '620px' }}>
          <div className="col-md-6">
            <div className="auth-form border rounded p-4" style={{ backgroundColor: 'transparent', borderRadius: '15px' }}>
              <h1 className="text-center">{isRegister ? 'Register' : 'Login'}</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleAuth}>
                <div className="form-group">
                  <label>Username:</label>
                  <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                {isRegister && (
                  <div className="form-group">
                    <label>Email:</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                )}
                <div className="form-group">
                  <label>Password:</label>
                  <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {isRegister && (
                  <div className="form-group">
                    <label>Confirm Password:</label>
                    <input type="password" className="form-control" value={passwordConfo} onChange={(e) => setPasswordConfo(e.target.value)} required />
                  </div>
                )}
                <div className="form-group text-center">
                  <button type="submit" className="btn btn-primary form-control">
                    {isRegister ? 'Register' : 'Login'}
                  </button>
                </div>
              </form>
              <div className="text-center mt-3">
                {isRegister ? (
                  <p>
                    Already have an account?{' '}
                    <span onClick={() => setIsRegister(false)} style={{ color: '#007bff', cursor: 'pointer' }}>
                      Login
                    </span>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{' '}
                    <span onClick={() => setIsRegister(true)} style={{ color: '#007bff', cursor: 'pointer' }}>
                      Register
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import './Auth.css';

const Signup = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfo, setPasswordConfo] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAuth = async (event) => {
    event.preventDefault();
    setError(null);

    if (isRegister) {
      if (password !== passwordConfo) {
        setError('Passwords do not match');
        return;
      }
      try {
        await axios.post('http://127.0.0.1:8000/register/', { username, email, password, password_confirmation: passwordConfo });
        alert('Registration successful! Logging you in...');
      } catch (error) {
        if (error.response?.data?.errors) {
          setError(Object.values(error.response.data.errors).join(' '));
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Failed to connect to API');
        }
        return;
      }
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', { username, password });
      const { token, username: name, isAdmin } = response.data;
      const loggedInUser = { username: name, token, isAdmin };
      dispatch(setUser(loggedInUser));
      if (isAdmin) {
        navigate('/listadmin')
    } else {
        navigate('/');
    }
    } catch (error) {
      if (error.response?.data?.errors) {
        setError(Object.values(error.response.data.errors).join(' '));
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to login user. Please contact admin');
      }
    }
  };

  useEffect(() => {
    const container = document.getElementById('container');
    setTimeout(() => {
      container.classList.add('right-panel-active');
    }, 200);
  }, []);

  const toggle = () => {
    const container = document.getElementById('container');
    container.classList.toggle('right-panel-active');
    setIsRegister(!isRegister);
  };

  return (
    <div>
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleAuth}>
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" value={passwordConfo} onChange={(e) => setPasswordConfo(e.target.value)} required />
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleAuth}>
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your account</span>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={toggle}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" onClick={toggle}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

