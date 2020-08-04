import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import axios from 'axios';

function Register({ history }) {
    const [isWhiteMode, setIsWhiteMode] = useState('false');

    let [validRegister, setValidRegister] = useState({
        isError: false,
        isSucceed: false,
        message: '',
    });

    const emailInput = useRef();
    const usernameInput = useRef();
    const passwordInput = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = emailInput.current.value.trim();
        const username = usernameInput.current.value.trim();
        const password = passwordInput.current.value.trim();
        if (username.length === 0 || password.length === 0) {
            setValidRegister({
                isError: true,
                message: 'Input must not be null',
            });
            return;
        }
        if (!email.match(/^[a-z][a-z0-9_\.]{4,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,5}){1,2}$/g)) {
            setValidRegister({
                isError: true,
                message: 'Email is not valid!',
            });
            return;
        }

        if (!password.match(/.{6,}/g)) {
            setValidRegister({
                isError: true,
                message: 'Password must contain at least six characters',
            });
            return;
        }
        if (password.includes(username)) {
            setValidRegister({
                isError: true,
                message: 'Password is too similar to the username',
            });
            return;
        }
        axios.get('/api/user/users').then((res) => {
            if (res.data.some((e) => e.username === username)) {
                setValidRegister({
                    isError: true,
                    message: 'Username is already taken',
                });
                return;
            }
            if (res.data.some((e) => e.email === email)) {
                setValidRegister({
                    isError: true,
                    message: 'Email is already taken',
                });
                return;
            }
        });
        axios
            .post('/api/user/register', { username, password, email })
            .then((res) => {
                if (res.status === 200) {
                    setValidRegister({
                        isError: false,
                        isSucceed: true,
                        message: 'Register Succeed!',
                    });
                }
            })
            .catch((err) => {
                // console.log(err.response.data);
            });
    };

    function removeErrorMessage() {
        setValidRegister({
            isError: false,
            message: '',
        });
    }

    const classStylingForm = classNames({
        container: true,
        'auth-form': true,
        whiteColor: isWhiteMode === 'false',
        darkColor: isWhiteMode === 'true',
    });

    useEffect(() => {
        const theme = JSON.parse(localStorage.getItem('whitemode'));
        setIsWhiteMode(theme);
    }, []);

    return (
        <form className={classStylingForm} onSubmit={handleSubmit}>
            <h1>Register</h1>
            <div>
                <h5>Email</h5>
                <input
                    ref={emailInput}
                    defaultValue={'nakdjlj@gmail.com'}
                    className="form-control"
                    type="text"
                />
            </div>
            <div>
                <h5>Username</h5>
                <input ref={usernameInput} className="form-control" type="text" />
            </div>
            <div>
                <h5>Password</h5>
                <input ref={passwordInput} className="form-control" type="password" />
            </div>
            <div>
                {validRegister.isError && (
                    <div className="alert alert-danger alert-dismissible my-4 fade show">
                        <button
                            type="button"
                            className="close"
                            data-dismiss="alert"
                            onClick={removeErrorMessage}>
                            &times;
                        </button>
                        {validRegister.message}
                    </div>
                )}
            </div>
            <div>
                {validRegister.isSucceed && (
                    <div className="alert alert-success alert-dismissible my-4 fade show">
                        <button
                            type="button"
                            className="close"
                            data-dismiss="alert"
                            onClick={removeErrorMessage}>
                            &times;
                        </button>
                        {validRegister.message}
                    </div>
                )}
            </div>
            <button type="submit" className="btn btn-info btn-block mt-4">
                Submit
            </button>
        </form>
    );
}

export default Register;
