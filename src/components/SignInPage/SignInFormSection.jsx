import styled from "styled-components";
import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useHistory } from "react-router-dom";
import { ModalPage } from '../Modal/Modal';

const SignInCont = styled.div`
  background: url(${"https://www.glassdoor.com/app/static/img/home/heroLaptop.jpg?v=674d79pgbp"});
  height: 590px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  & > div > div > p:nth-of-type(1) {
    font-size: 12px;
  }
  p {
    font-size: 20px;
  }
  form {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }
  input {
    height: 30px;
    width: 75%;
    padding: 1.5%;
    border-radius: 5px;
    border: none;
    margin: 5px auto;
  }
  * {
    margin: 0;
  }
  button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    margin: 10px auto;
    align-items: center;
    border: none;
    width: 80%;
    position: relative;
    height: 37px;
    border-radius: 5px;
    & > div {
      position: absolute;
      left: 10px;
    }
  }
  form > button {
    background-color: rgb(24, 119, 242);
    width: 180px;
    color: rgb(171, 204, 247);
    font-weight: bold;
    font-size: 15px;
  }

  & > div > div > button > div > div {
    position: absolute;
    left: 15px;
  }

  & > div > div {
    width: 500px;
    margin: auto;
    height: 65%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  & > div {
    z-index: 1;
    background-color: rgb(80, 88, 99, 0.3);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export function SignInFormSection() {
  const [loginData, setLoginData] = useState({});
  const history = useHistory();
  const [modalStatus, setModalStatus] = useState({
    isOpen: false,
    messege: ""
  });

  const handleHideModal = () => {
    setTimeout(() => {
      setModalStatus({ ...modalStatus, isOpen: false, messege: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('https://glassdoor-backend.vercel.app/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: loginData.email,
                password: loginData.password
            })
        });
        const data = await response.json();
        if (response.ok) {
            // Save the response in local storage
            localStorage.setItem('user', JSON.stringify(data));
            history.push("/Dashboard");
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        setModalStatus({ ...modalStatus, isOpen: true, messege: error.message });
        handleHideModal();
    }
};

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://glassdoor-backend.vercel.app/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        setIsRegistered("block");
        setIsInvalid("none");
        setLoginData({ email: "", password: "" });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setModalStatus({ ...modalStatus, isOpen: true, messege: error.message });
      handleHideModal();
    }
  };

  const [isRegistered, setIsRegistered] = useState("none");
  const [isInValid, setIsInvalid] = useState("none");
  const [isSigningIn, setIsSigningIn] = useState(true);

  return (
    <>
      <ModalPage isOpen={modalStatus.isOpen} messege={modalStatus.messege} />
      <SignInCont>
        <div>
          <div>
            <h1 style={{ color: "white" }}>Find The Job That Fits Your Life</h1>
            <p style={{ color: "white" }}>
              By continuing, you agree to our Terms of Use and Privacy Policy.
            </p>
            <div>
              <button style={{ backgroundColor: "rgb(24,119,242)", color: "white" }}>
                <div>
                  <FaFacebook fontSize="25px" color="white" />
                </div>
                <h3>Continue With Facebook</h3>
              </button>
              <button style={{ color: "rgb(220,78,65)", backgroundColor: "white", marginBottom: "10px" }}>
                <div>
                  <FcGoogle fontSize="25px" />
                </div>
                <h3>Continue With Google</h3>
              </button>
            </div>

            <hr />
            <form action="">
              <h3 style={{ color: "greenyellow", display: isRegistered }}>
                Successfully Registered
              </h3>
              <h3 style={{ color: "yellow", display: isInValid }}>
                Invalid Credentials!
              </h3>
              <input
                type="text"
                name="email"
                value={loginData.email}
                placeholder="Enter email"
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                value={loginData.password}
                placeholder="Password"
                onChange={handleChange}
              />
              {isSigningIn ? (
                <button onClick={handleLogin} style={{ color: "white" }}>
                  Continue with Email
                </button>
              ) : (
                <button onClick={handleSignUp} style={{ color: "white" }}>
                  Sign Up
                </button>
              )}
            </form>
            <p
              style={{ color: "white", cursor: "pointer" }}
              onClick={() => setIsSigningIn(!isSigningIn)}
            >
              {isSigningIn ? "Click here to Sign Up" : "Click here to Sign In"}
            </p>
          </div>
        </div>
      </SignInCont>
    </>
  );
}
