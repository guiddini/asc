import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Row, Col } from "react-bootstrap";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isLoading: boolean;
  initialValue?: string;
  submitText?: string;
  onCancel?: () => void;
  showCancel?: boolean;
}

interface FormData {
  content: string;
}

const schema = yup.object({
  content: yup
    .string()
    .required("Comment content is required")
    .min(1, "Comment cannot be empty"),
});

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  isLoading,
  initialValue = "",
  submitText = "Post Comment",
  onCancel,
  showCancel = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      content: initialValue,
    },
  });

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data.content);
    if (!showCancel) {
      reset(); // Only reset if it's a new comment, not editing
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Write your comment..."
          {...register("content")}
          isInvalid={!!errors.content}
        />
        <Form.Control.Feedback type="invalid">
          {errors.content?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col>
          <div className="d-flex gap-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {submitText}...
                </>
              ) : (
                submitText
              )}
            </Button>

            {showCancel && onCancel && (
              <Button
                type="button"
                variant="outline-secondary"
                size="sm"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default CommentForm;
