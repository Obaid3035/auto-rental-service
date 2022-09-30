import React, {ReactElement, useState} from 'react';
import axios from "axios";
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import './Auth.css'

export interface FormInput {
    name: string,
    email: string,
    password: string,
}



const Auth: React.FC = () => {

    const emptyInput: FormInput = {
        name: '',
        email: '',
        password: '',
    }

    const [formData, setFormData] = useState<FormInput>({...emptyInput});
    const [errorData, setErrorData] = useState<FormInput>({...emptyInput});
    const [error, setError] = useState<string>('')
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);


    const changeStatusHandler = (check: boolean) => {
        setErrorData({...emptyInput})
        setFormData({...emptyInput})
        setIsSignUp(check);
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;

        setError('');
        setErrorData({
            ...errorData,
            [name]: ''
        })
        setFormData({
            ...formData,
            [name]: value
        })


    }

    const validate = (): boolean => {
        let errors: FormInput = {...emptyInput};
        let formIsValid = true;

        if (!formData["email"]) {
            formIsValid = false;
            errors["email"] = "Cannot be empty";
        }

        if (typeof formData["email"] !== "undefined") {
            let lastAtPos = formData["email"].lastIndexOf("@");
            let lastDotPos = formData["email"].lastIndexOf(".");

            if (
                !(
                    lastAtPos < lastDotPos &&
                    lastAtPos > 0 &&
                    formData["email"].indexOf("@@") === -1 &&
                    lastDotPos > 2 &&
                    formData["email"].length - lastDotPos > 2
                )
            ) {
                formIsValid = false;
                errors["email"] = "Email is not valid";
            }
        }

        if(formData['password'].length < 7) {
            formIsValid = false;
            errors["password"] = "Password must be at least 7 characters";
        }


        if (isSignUp && !formData["name"]) {
            formIsValid = false;
            errors["name"] = "Cannot be empty";
        }

        if (isSignUp && typeof formData["name"] !== "undefined") {
            if (!formData["name"].match(/^[a-zA-Z ]+$/)) {
                formIsValid = false;
                errors["name"] = "Only letters";
            }
        }

        setErrorData({...errors});
        return formIsValid

    }

    const onSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        setLoader(true);

        const formInput = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        }

        setError('');
        if (validate()) {
            if (isSignUp) {
                axios.post('/auth/register', formInput)
                    .then((res) => {
                        if (res.data.saved) {
                            localStorage.setItem('token', res.data.token);
                            setLoader(false)
                            window.location.href = '/'
                        }
                    }).catch((err) => {
                    if (err.response) {
                        setError(err.response.data.message);
                    }
                }).finally(() => {
                    setLoader(false)
                })
            } else {
                axios.post('/auth/login', { email: formData.email, password: formData.password})
                    .then((res) => {
                        if (res.data.auth) {
                            localStorage.setItem('token', res.data.token);
                            setLoader(false)
                            window.location.href = '/'
                        }
                    }).catch((err) => {
                    if (err.response) {
                        setError(err.response.data.message);
                    }
                }).finally(() => {
                    setLoader(false)
                })
            }
        } else {
            setLoader(false)
        }

    }

    let status: string = 'Login';
    let alreadyAMember: ReactElement = (
        <p
            className="text-muted text-center mt-4"
            id={'already-to-login'}
            onClick={() => changeStatusHandler(true)}>
            Become a Member
        </p>
    )

    // if (isSignUp) {
    //     status = 'Register'
    //     alreadyAMember = (
    //         <p
    //             className="text-muted text-center"
    //             id={'already-to-login'}
    //             onClick={() => changeStatusHandler(false)}>
    //             Already a Member?
    //         </p>
    //     )
    // }

    let submitBtn: ReactElement = (
        <button type="submit" className={'w-100 my-2 py-2 '}>
            {status}
        </button>
    )

    if (loader) {
        submitBtn = (
            <div className="text-center">
                <Spinner animation={"border"} style={{
                    color: '#077FF6'
                }}/>
            </div>
        )
    }

    const errorElement = (msg: string | File) => {
        return <p className={'m-0 p-0 error'}>{msg}</p>

    }

    return (
        <div className={'h-100'} id={'container'}>
            <Row className={' align-items-center h-100 mx-0'}>
                <Col md={6} id={'left-section'} className={'d-xs-none'}/>
                <Col md={6}>
                    <Row className={'justify-content-center'}>
                        <Col md={8} className={'form_div'}>
                            <h3 className={'text-center heading-blue'} id={'login-heading'}>AUTO CARS</h3>
                            <p className={'text-muted text-center'}>{
                                // isSignUp ? "Please complete to create your account."
                                //     : "Welcome back! Please login to your account."
                                "Welcome back! Please login to your account."
                            }</p>
                            <h5 className={'error text-center'}>{error}</h5>
                            <Form className={'w-100'} id={'auth'} onSubmit={onSubmitHandler}>
                                {/*{*/}
                                {/*    isSignUp ?*/}
                                {/*        <>*/}
                                {/*            <Form.Group className="mb-3">*/}
                                {/*                {errorElement(errorData['name'])}*/}
                                {/*                <Form.Control type="text" name={'name'} placeholder="Full Name" className={errorData['name'] ? 'field-input-error animate__animated animate__headShake mb-4' : 'field-input mb-4'} onChange={onChangeHandler} value={formData.name}/>*/}
                                {/*            </Form.Group>*/}
                                {/*        </>*/}
                                {/*        : null*/}
                                {/*}*/}

                                <Form.Group className="mb-3">
                                    {errorElement(errorData.email)}
                                    <Form.Control type="email" name={'email'} placeholder="Email ID" className={errorData['email'] ? 'field-input-error animate__animated animate__headShake mb-4' : 'field-input mb-4'} onChange={onChangeHandler}  value={formData.email} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    {errorElement(errorData.password)}
                                    <Form.Control type="password" name={'password'} placeholder="Password" className={errorData['password'] ? 'field-input-error animate__animated animate__headShake mb-4' : 'field-input mb-4'} onChange={onChangeHandler}  value={formData.password} />
                                </Form.Group>

                                {/*{ alreadyAMember }*/}
                                { submitBtn }
                            </Form>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default Auth;
