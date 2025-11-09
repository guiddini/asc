import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { showSideEventById, updateSideEvent } from "../../apis/side-event";
import { useNavigate, useParams } from "react-router-dom";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import { toast } from "react-hot-toast";
import { CreateSideEventRequest, SideEvent } from "../../types/side-event";
import getMediaUrl from "../../helpers/getMediaUrl";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  location: Yup.string(),
  website: Yup.string().url("Must be a valid URL"),
  email: Yup.string().email("Must be a valid email"),
  date: Yup.string(),
  categories: Yup.array().of(Yup.string()),
  status: Yup.string().oneOf(["draft", "published"]),
});

const UpdateSideEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingLogo, setExistingLogo] = useState<string | null>(null);
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      website: "",
      email: "",
      date: "",
      categories: [] as string[],
      status: "draft",
    },
  });

  const sideEventQuery = useQuery(
    ["side-event", id],
    () => showSideEventById(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        const sideEvent = data;
        reset({
          name: sideEvent.name,
          description: sideEvent.description || "",
          location: sideEvent.location || "",
          website: sideEvent.website || "",
          email: sideEvent.email || "",
          date: sideEvent.date || "",
          categories: sideEvent.categories || [],
          status: sideEvent.status,
        });
        setExistingLogo(sideEvent.logo);
        setExistingCover(sideEvent.cover);
        setExistingGallery(sideEvent.gallery || []);
      },
    }
  );

  const updateMutation = useMutation({
    mutationFn: (data: CreateSideEventRequest) => updateSideEvent(id, data),
    onSuccess: () => {
      toast.success("Side event updated successfully");
      navigate("/side-events-management");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update side event"
      );
    },
  });

  const onSubmit = (data: any) => {
    const payload: CreateSideEventRequest = {
      ...data,
      gallery: galleryFiles,
    };

    // Only include files if a new file was selected; avoid sending null or strings
    if (logoFile) {
      payload.logo = logoFile;
    }
    if (coverFile) {
      payload.cover = coverFile;
    }

    updateMutation.mutate(payload);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
      setExistingLogo(null);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverFile(e.target.files[0]);
      setExistingCover(null);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setGalleryFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index: number) => {
    setExistingGallery((prev) => prev.filter((_, i) => i !== index));
  };

  if (sideEventQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <KTCard>
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          <h3 className="fw-bolder">Update Side Event</h3>
        </div>
        <div className="card-toolbar">
          <Button
            variant="light"
            className="me-3"
            onClick={() => navigate("/side-events-management")}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      <KTCardBody>
        <Form>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Name *</Form.Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      isInvalid={!!errors.name}
                      placeholder="Enter side event name"
                    />
                  )}
                />
                {errors.name && (
                  <Form.Control.Feedback type="invalid">
                    {errors.name.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Description</Form.Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      {...field}
                      isInvalid={!!errors.description}
                      placeholder="Enter description"
                    />
                  )}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Location</Form.Label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      isInvalid={!!errors.location}
                      placeholder="Enter location"
                    />
                  )}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Date</Form.Label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      type="date"
                      {...field}
                      isInvalid={!!errors.date}
                    />
                  )}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Website</Form.Label>
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      isInvalid={!!errors.website}
                      placeholder="Enter website URL"
                    />
                  )}
                />
                {errors.website && (
                  <Form.Control.Feedback type="invalid">
                    {errors.website.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      isInvalid={!!errors.email}
                      placeholder="Enter email"
                    />
                  )}
                />
                {errors.email && (
                  <Form.Control.Feedback type="invalid">
                    {errors.email.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Categories</Form.Label>
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      isInvalid={!!errors.categories}
                      placeholder="Enter categories separated by commas"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value
                            ? value.split(",").map((item) => item.trim())
                            : []
                        );
                      }}
                      value={(field.value || []).join(", ")}
                    />
                  )}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Status</Form.Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Form.Select {...field} isInvalid={!!errors.status}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </Form.Select>
                  )}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={4}>
              <Card className="h-100">
                <Card.Header>
                  <Card.Title>Logo</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                    {logoFile && (
                      <div className="mt-3">
                        <img
                          src={URL.createObjectURL(logoFile)}
                          alt="Logo preview"
                          style={{ maxWidth: "100%", maxHeight: "150px" }}
                        />
                      </div>
                    )}
                    {existingLogo && !logoFile && (
                      <div className="mt-3">
                        <img
                          src={getMediaUrl(existingLogo)}
                          alt="Existing logo"
                          style={{ maxWidth: "100%", maxHeight: "150px" }}
                        />
                      </div>
                    )}
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
            <Col md={8}>
              <Card className="h-100">
                <Card.Header>
                  <Card.Title>Cover Image</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                    />
                    {coverFile && (
                      <div className="mt-3">
                        <img
                          src={URL.createObjectURL(coverFile)}
                          alt="Cover preview"
                          style={{ maxWidth: "100%", maxHeight: "150px" }}
                        />
                      </div>
                    )}
                    {existingCover && !coverFile && (
                      <div className="mt-3">
                        <img
                          src={getMediaUrl(existingCover)}
                          alt="Existing cover"
                          style={{ maxWidth: "100%", maxHeight: "150px" }}
                        />
                      </div>
                    )}
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Gallery</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryChange}
                  multiple
                />
              </Form.Group>

              {/* New gallery images */}
              {galleryFiles.length > 0 && (
                <div className="mt-4">
                  <h6>New Images</h6>
                  <div className="d-flex flex-wrap gap-3">
                    {galleryFiles.map((file, index) => (
                      <div key={index} className="position-relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Gallery ${index}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                          className="rounded"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          onClick={() => removeGalleryImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing gallery images */}
              {existingGallery.length > 0 && (
                <div className="mt-4">
                  <h6>Existing Images</h6>
                  <div className="d-flex flex-wrap gap-3">
                    {existingGallery.map((image, index) => (
                      <div key={index} className="position-relative">
                        <img
                          src={getMediaUrl(image)}
                          alt={`Existing Gallery ${index}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                          className="rounded"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          onClick={() => removeExistingGalleryImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Form>
      </KTCardBody>
    </KTCard>
  );
};

export default UpdateSideEvent;
