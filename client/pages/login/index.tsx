import React from 'react';

const Login: React.FC = () => {
    const handleSignUp = async (e: any) => {
        e.preventDefault();
        const user = {
            "email": "francois.nguinbu@epita.fr",
            "pass": "zzzzzz"
        }
        const response = await fetch('http://localhost:3001/auth/signup', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        });

        const responseJson = await response.json();
        if (responseJson.status !== "success") {
            alert('failure')
        }
        else{
            alert("success")
        }
    };
    const handleLogIn = async (e: any) => {
        e.preventDefault();
        const user = {
            "email": "francois.nguinbu@epita.fr",
            "pass": "zzzzzz"
        }
        const response = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', // Include cookies with the request
            body: JSON.stringify(user)
        });

        const responseJson = await response.json();
        if (responseJson.status !== "success") {
            alert('failure')
        }
        else{
            alert("success")
        }
    };
    return (
        <div>
            <h1>Log in page</h1>
            <input key="email" type="text" className="signUpInput" name="email" placeholder="email" required />
            <input key="password" type="password" className="signUpInput" name="password" placeholder="password" required />
            <button onClick={handleSignUp} >Sign Up</button>
            <input key="email" type="text" className="logInInput" name="email" placeholder="email" required />
            <input key="password" type="password" className="sLogInInput" name="password" placeholder="password" required />
            <button onClick={handleLogIn} >Log In</button>
        </div>
    );
};

export default Login;
