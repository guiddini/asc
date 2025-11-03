import React from "react";
import { Row, Col, Form, Button, Spinner, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { createContactRequest } from "../../apis/contact";
import type { ContactRequestPayload } from "../../types/contact";

// Validation schema using yup
const schema = yup
  .object({
    fname: yup.string().required("First name is required").defined(),
    lname: yup.string().required("Last name is required").defined(),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required")
      .defined(),
    phone: yup.string().optional(),
    message: yup
      .string()
      .required("Please write a message")
      .min(10, "Message should be at least 10 characters")
      .defined(),
  })
  .required();

type ContactFormValues = yup.InferType<typeof schema>;

const ContactPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const { mutate, isLoading } = useMutation(createContactRequest);

  const onSubmit = (values: ContactFormValues) => {
    const payload: ContactRequestPayload = {
      fname: values.fname,
      lname: values.lname,
      email: values.email,
      phone: values.phone,
      message: values.message,
      company_name: null as unknown as string,
      position: null as unknown as string,
      type: "contact",
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Your message has been sent successfully.");
        reset();
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Failed to send message";
        toast.error(msg);
      },
    });
  };

  return (
    <div id="contact-page-wrapper">
      {/* Hero Section (following program page style) */}
      <div id="contact-hero-section" className="py-10 py-md-20 bg-dark">
        <div className="container-xxl">
          <div className="text-center text-white">
            <div className="badge bg-primary mb-3">Contact • 2025</div>
            <h1 className="display-5 fw-bold mb-3 text-white">Get in Touch</h1>
            <p className="fs-6 fw-semibold opacity-75">
              Reach out for partnerships, information, or general inquiries.
              We’ll get back to you shortly.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container-xxl py-10">
        <div className="mb-8 text-center">
          <h2 className="fw-bold">Send us a message</h2>
          <p className="text-muted">
            Fill the form below and our team will contact you.
          </p>
        </div>

        <Container>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="g-6">
              <Col md={6}>
                <Form.Group controlId="fname">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="John"
                    isInvalid={!!errors.fname}
                    {...register("fname")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fname?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="lname">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Doe"
                    isInvalid={!!errors.lname}
                    {...register("lname")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lname?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="john.doe@example.com"
                    isInvalid={!!errors.email}
                    {...register("email")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="phone">
                  <Form.Label>Phone (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="+213 555 55 55 55"
                    isInvalid={!!errors.phone}
                    {...register("phone")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="message">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="Tell us how we can help you"
                    isInvalid={!!errors.message}
                    {...register("message")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.message?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12} className="d-flex justify-content-end">
                <Button type="submit" disabled={isLoading} className="px-6">
                  {isLoading ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default ContactPage;
