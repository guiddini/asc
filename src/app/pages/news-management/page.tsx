import { useEffect } from "react";
import { TableComponent } from "../../components";
import { useMutation } from "react-query";
import { searchBlogs } from "../../apis";
import moment from "moment";
import getMediaUrl from "../../helpers/getMediaUrl";
import { News } from "./types/news";
import NewsActionColumn from "./components/news-action-column";
import { useNavigate } from "react-router-dom";

const NewsManagementPage = () => {
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
      selector: (row: News) =>
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
      selector: (row: News) => row.title,
      sortable: true,
    },
    {
      name: "Slug",
      selector: (row: News) => row.slug,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: News) =>
        row.status === "draft"
          ? "Draft"
          : row.status === "published"
          ? "Published"
          : "Archived",
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row: News) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Updated At",
      selector: (row: News) => moment(row.updated_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row: News) => <NewsActionColumn blog={row} />,
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
        placeholder="news"
        onAddClick={() => navigate("/news-management/create")}
        showSearch={true}
        searchKeys={["title", "slug"]}
        showCreate
        isLoading={searchMutation.isLoading}
      />
    </>
  );
};

export default NewsManagementPage;
