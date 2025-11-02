import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Row, Col } from "react-bootstrap";
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
import { useMutation, useQueryClient } from "react-query";
import { createBlogApi } from "../../../apis";
import { KTCard, KTCardBody } from "../../../../_metronic/helpers";
import { MediaFormData } from "../types/media";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  title: yup.string().required("Title is required"),
  slug: yup.string().required("Slug is required"),
  content: yup.string().required("Content is required"),
  cover_image: yup.mixed<File>().nullable(),
  excerpt: yup.string().required("Excerpt is required"),
  status: yup
    .mixed<"draft" | "published">()
    .oneOf(["draft", "published"])
    .required(),
});

const CreateMediaPage = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      status: "published",
    },
  });

  const mutation = useMutation({
    mutationKey: "createBlog",
    mutationFn: (data: FormData) => createBlogApi(data),
    onSuccess() {
      toast.success("Media created successfully");
      queryClient.invalidateQueries(["blogs"]);
      reset();
      navigation("/media-management");
    },
    onError() {
      toast.error("Error while creating the media");
    },
  });

  const onSubmit = (data: MediaFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("content", data.content);
    formData.append("excerpt", data.excerpt);
    formData.append("status", data.status);
    if (data.cover_image) {
      formData.append("cover_image", data.cover_image);
    }
    mutation.mutate(formData);
  };

  return (
    <KTCard>
      <KTCardBody>
        <h3>Create Media</h3>
        <Form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <Row className="mb-3">
            <Col>
              <Form.Group>
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
            <Col>
              <Form.Group>
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
            />
            <Form.Control.Feedback type="invalid">
              {errors.excerpt?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cover Image</Form.Label>
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
                  markdown={field.value}
                  onChange={field.onChange}
                  plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    linkPlugin(),
                    tablePlugin(),
                    thematicBreakPlugin(),
                    codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
                    codeMirrorPlugin({
                      codeBlockLanguages: {
                        js: "JavaScript",
                        ts: "TypeScript",
                        py: "Python",
                        php: "PHP",
                        html: "HTML",
                        css: "CSS",
                        json: "JSON",
                      },
                    }),
                    diffSourcePlugin(),
                    markdownShortcutPlugin(),
                    imagePlugin({
                      imageUploadHandler: async (file: File) => {
                        const formData = new FormData();
                        formData.append("file", file);

                        const res = await fetch("/api/uploads/images", {
                          method: "POST",
                          body: formData,
                        });

                        const data = await res.json();

                        return data.url;
                      },
                    }),
                    toolbarPlugin({
                      toolbarContents: () => (
                        <>
                          <UndoRedo />
                          <Separator />
                          <BoldItalicUnderlineToggles />
                          <Separator />
                          <BlockTypeSelect />
                          <ListsToggle />
                          <Separator />
                          <CreateLink />
                          <InsertImage />
                          <InsertTable />
                          <InsertThematicBreak />
                          <Separator />
                          <InsertCodeBlock />
                          <CodeToggle />
                        </>
                      ),
                    }),
                  ]}
                />
              )}
            />

            {errors.content && (
              <p className="text-danger">{errors.content.message}</p>
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

          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Saving..." : "Create Media"}
          </Button>
        </Form>
      </KTCardBody>
    </KTCard>
  );
};

export default CreateMediaPage;
