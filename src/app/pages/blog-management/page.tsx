import { useEffect } from "react";
import { TableComponent } from "../../components";
import { useMutation } from "react-query";
import { searchBlogs } from "../../apis";
import moment from "moment";
import getMediaUrl from "../../helpers/getMediaUrl";
import { Blog } from "./types/blog";
import BlogActionColumn from "./components/blog-action-column";
import { useNavigate } from "react-router-dom";

const BlogsManagementPage = () => {
  const navigate = useNavigate();
  const searchMutation = useMutation({
    mutationFn: searchBlogs,
    mutationKey: ["blogs"],
  });

  useEffect(() => {
    searchMutation.mutate({ title: "" });
  }, []);

  const data = searchMutation.data || [];

  const columns = [
    {
      name: "",
      selector: (row: Blog) =>
        row.cover_image ? (
          <div className="symbol symbol-circle symbol-40px overflow-hidden me-3 my-2">
            <div className="symbol-label">
              <img
                alt={row.title}
                src={getMediaUrl(row.cover_image)}
                className="w-100"
              />
            </div>
          </div>
        ) : (
          "-"
        ),
      sortable: false,
    },
    {
      name: "Title",
      selector: (row: Blog) => row.title,
      sortable: true,
    },
    {
      name: "Slug",
      selector: (row: Blog) => row.slug,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: Blog) =>
        row.status === "draft"
          ? "Draft"
          : row.status === "published"
          ? "Published"
          : "Archived",
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row: Blog) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Updated At",
      selector: (row: Blog) => moment(row.updated_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row: Blog) => <BlogActionColumn blog={row} />,
      sortable: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      <TableComponent
        columns={columns as any}
        data={data}
        placeholder="blogs"
        onAddClick={() => navigate("/blogs-management/create")}
        showSearch={true}
        searchKeys={["title", "slug"]}
        showCreate
        isLoading={searchMutation.isLoading}
      />
    </>
  );
};

export default BlogsManagementPage;
