// import React from 'react';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useUser } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { Spinner } from 'react-bootstrap';

// const Login = () => {
//     const { login } = useUser();
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = (values, { setSubmitting }) => {
//         // Simulate login API call
//         setTimeout(() => {
//             login({ username: values.username });
//             navigate('/chat');
//             toast.success('Logged in successfully!');
//             setSubmitting(false);
//         }, 500);
//     };

//     return (
//         <React.Fragment>
//             <div className="container">
//                 <h2>Login</h2>
//                 <Formik
//                     initialValues={{ username: '', password: '' }}
//                     validationSchema={Yup.object({
//                         username: Yup.string().required('Required'),
//                         password: Yup.string().required('Required'),
//                     })}
//                     onSubmit={handleSubmit}
//                 >
//                     <Form>
//                         <div className="form-group">
//                             <label htmlFor="username">Username</label>
//                             <Field name="username" type="text" className="form-control" />
//                             <ErrorMessage name="username" component="div" className="text-danger" />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="password">Password</label>
//                             <Field name="password" type="password" className="form-control" />
//                             <ErrorMessage name="password" component="div" className="text-danger" />
//                         </div>
//                         <button type="submit" className="btn btn-primary">Login</button>
//                     </Form>
//                 </Formik>
//             </div>
//             {loading && <Spinner animation="border" />}
//         </React.Fragment>
//     );
// };

// export default Login;

import React, { useState, useContext } from 'react';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import authService from '../../services/AuthService.js';

function Login() {
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      phoneNumber: Yup.string().required('Required'),
      otp: Yup.string().min(4, 'otp must be at least 4 characters').required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const user = await authService.login(values.phoneNumber, values.otp);
        loginUser(user);
        toast.success('Successfully logged in!');
        navigate('/chat');
      } catch (error) {
        toast.error('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container>
      <h2>Login</h2>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="phoneNumber"
            placeholder="Enter PhoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
            <div className="text-danger">{formik.errors.phoneNumber}</div>
          ) : null}
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>OTP Token</Form.Label>
          <Form.Control
            type="text"
            name="otp"
            placeholder="otp token"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.otp && formik.errors.otp ? (
            <div className="text-danger">{formik.errors.otp}</div>
          ) : null}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
