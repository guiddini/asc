import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Row, Col, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  linkPlugin,
  tablePlugin,
  thematicBreakPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  imagePlugin,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  InsertTable,
  CreateLink,
  Separator,
  CodeToggle,
  UndoRedo,
  InsertThematicBreak,
  InsertCodeBlock,
  InsertImage,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getBlogById, updateBlogApi } from "../../../apis";
import { KTCard, KTCardBody } from "../../../../_metronic/helpers";
import { NewsFormData } from "../types/news";
import getMediaUrl from "../../../helpers/getMediaUrl";

const schema = yup.object({
  title: yup.string().required("Title is required"),
  slug: yup.string().required("Slug is required"),
  content: yup.string().required("Content is required"),
  cover_image: yup.mixed<File>().nullable(),
  excerpt: yup.string().required(),
  status: yup
    .mixed<"draft" | "published">()
    .oneOf(["draft", "published"])
    .required(),
});

const UpdateNewsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(["blog", id], () => getBlogById(id!), {
    enabled: !!id,
    retry: 1,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      status: "published",
      cover_image: null,
    },
  });

  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (data) {
      console.log("API Data:", data);
      console.log("Content from API:", data.content);

      reset({
        title: data.title || "",
        slug: data.slug || "",
        content: data.content || "",
        excerpt: data.excerpt || "",
        status: data.status || "published",
      });

      // Force MDXEditor to update with the initial content
      if (editorRef.current && data.content) {
        editorRef.current.setMarkdown(data.content);
      }
    }
  }, [data, reset]);

  const mutation = useMutation(
    (formData: FormData) => updateBlogApi(formData),
    {
      onSuccess: () => {
        toast.success("News updated successfully");
        queryClient.invalidateQueries(["blogs"]);
        navigate("/news-management");
      },
      onError: () => {
        toast.error("Error while updating the news");
      },
    }
  );

  const onSubmit = (data: NewsFormData) => {
    const formData = new FormData();
    formData.append("id", id!);
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("content", data.content);
    formData.append("excerpt", data.excerpt || "");
    formData.append("status", data.status);
    if (data.cover_image) {
      formData.append("cover_image", data.cover_image);
    }
    mutation.mutate(formData);
  };

  const contentValue = watch("content");

  if (isLoading) return <div>Loading...</div>;

  return (
    <KTCard>
      <KTCardBody>
        <div className="d-flex flex-column">
          <h2 className="mb-10">Update News</h2>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("title")}
                    isInvalid={!!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Slug</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("slug")}
                    isInvalid={!!errors.slug}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.slug?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Excerpt</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register("excerpt")}
                isInvalid={!!errors.excerpt}
                placeholder="brief description of the news post"
              />
              <Form.Control.Feedback type="invalid">
                {errors.excerpt?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cover Image</Form.Label>
              {data?.cover_image && (
                <div className="mb-3">
                  <p className="mb-2">
                    <strong>Current Cover Image:</strong>
                  </p>
                  <Image
                    src={getMediaUrl(data.cover_image)}
                    alt="Current cover image"
                    thumbnail
                    style={{ maxWidth: "300px", maxHeight: "200px" }}
                  />
                  <div className="mt-2">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Upload a new image to replace the current cover image
                    </small>
                  </div>
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file =
                    e.target.files && e.target.files[0]
                      ? e.target.files[0]
                      : null;
                  setValue("cover_image", file);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <MDXEditor
                    ref={editorRef}
                    markdown={field.value || ""}
                    onChange={(value) => field.onChange(value)}
                    plugins={[
                      headingsPlugin(),
                      listsPlugin(),
                      quotePlugin(),
                      linkPlugin(),
                      tablePlugin(),
                      thematicBreakPlugin(),
                      codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
                      codeMirrorPlugin({
                        codeBlockLanguages: {
                          js: "JavaScript",
                          css: "CSS",
                          txt: "text",
                          tsx: "TypeScript",
                        },
                      }),
                      diffSourcePlugin({
                        viewMode: "rich-text",
                        diffMarkdown: field.value || "",
                      }),
                      markdownShortcutPlugin(),
                      imagePlugin({
                        imageUploadHandler: async (file) => {
                          const formData = new FormData();
                          formData.append("file", file);
                          const res = await fetch("/api/uploads/images", {
                            method: "POST",
                            body: formData,
                          });
                          const uploaded = await res.json();
                          return uploaded.url;
                        },
                      }),
                      toolbarPlugin({
                        toolbarContents: () => (
                          <>
                            <UndoRedo />
                            <Separator />
                            <BoldItalicUnderlineToggles />
                            <CodeToggle />
                            <Separator />
                            <ListsToggle />
                            <Separator />
                            <BlockTypeSelect />
                            <Separator />
                            <CreateLink />
                            <InsertImage />
                            <Separator />
                            <InsertTable />
                            <InsertThematicBreak />
                            <InsertCodeBlock />
                          </>
                        ),
                      }),
                    ]}
                  />
                )}
              />
              {errors.content && (
                <div className="text-danger mt-1">{errors.content.message}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select {...register("status")} isInvalid={!!errors.status}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.status?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Updating..." : "Update News"}
            </Button>
          </Form>
        </div>
      </KTCardBody>
    </KTCard>
  );
};

export default UpdateNewsPage;
