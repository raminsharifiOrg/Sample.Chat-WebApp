// import React from 'react';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { toast } from 'react-toastify';

// const Register = () => {
//   const handleSubmit = (values, { setSubmitting }) => {
//     // Simulate registration API call
//     setTimeout(() => {
//       toast.success('Registered successfully!');
//       setSubmitting(false);
//     }, 500);
//   };

//   return (
//     <div className="container">
//       <h2>Register</h2>
//       <Formik
//         initialValues={{ username: '', password: '' }}
//         validationSchema={Yup.object({
//           username: Yup.string().required('Required'),
//           password: Yup.string().required('Required'),
//         })}
//         onSubmit={handleSubmit}
//       >
//         <Form>
//           <div className="form-group">
//             <label htmlFor="username">Username</label>
//             <Field name="username" type="text" className="form-control" />
//             <ErrorMessage name="username" component="div" className="text-danger" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <Field name="password" type="password" className="form-control" />
//             <ErrorMessage name="password" component="div" className="text-danger" />
//           </div>
//           <button type="submit" className="btn btn-primary">Register</button>
//         </Form>
//       </Formik>
//     </div>
//   );
// };

// export default Register;

import React, { useState, useContext } from 'react';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import authService from '../../services/AuthService.js';

function Register() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      phoneNumber: Yup.string().required('Required'),
      otp: Yup.string().min(4, 'Password must be at least 6 characters').required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
       await authService.register(values.phoneNumber, values.otp, values.firstName, values.lastName);
        toast.success('Successfully registered!');
        navigate('/login');
      } catch (error) {
        toast.error('Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container>
      <h2>Register</h2>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="text"
            name="phoneNumber"
            placeholder="Enter Phone Number"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
            <div className="text-danger">{formik.errors.phoneNumber}</div>
          ) : null}
        </Form.Group>

        <Form.Group controlId="formBasicfirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            placeholder="Enter firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div className="text-danger">{formik.errors.firstName}</div>
          ) : null}
        </Form.Group>

        <Form.Group controlId="formBasiclastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            placeholder="Enter lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div className="text-danger">{formik.errors.lastName}</div>
          ) : null}
        </Form.Group>

        <Form.Group controlId="formBasicotp">
          <Form.Label>OTP Token</Form.Label>
          <Form.Control
            type="text"
            name="otp"
            placeholder="OTP Token"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.otp && formik.errors.otp ? (
            <div className="text-danger">{formik.errors.otp}</div>
          ) : null}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Register'}
        </Button>
      </Form>
    </Container>
  );
}

export default Register;
