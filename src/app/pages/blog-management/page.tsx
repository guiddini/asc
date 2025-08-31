import React, { useEffect } from "react";
import { TableComponent } from "../../components";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { useMutation } from "react-query";
import { searchBlogs } from "../../apis";
import moment from "moment";
import getMediaUrl from "../../helpers/getMediaUrl";
import { Blog } from "./types/blog";
import BlogActionColumn from "./components/blog-action-column";

const blogsBreadcrumbs: Array<PageLink> = [
  {
    title: "Blogs Management",
    path: "/blogs-management",
    isSeparator: false,
    isActive: false,
  },
];

const BlogsManagementPage = () => {
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
      name: "Titre",
      selector: (row: Blog) => row.title,
      sortable: true,
    },
    {
      name: "Slug",
      selector: (row: Blog) => row.slug,
      sortable: true,
    },
    {
      name: "Statut",
      selector: (row: Blog) =>
        row.status === "draft"
          ? "Brouillon"
          : row.status === "published"
          ? "Publié"
          : "Archivé",
      sortable: true,
    },

    {
      name: "Créé à",
      selector: (row: Blog) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Mis à jour",
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
      <PageTitle breadcrumbs={blogsBreadcrumbs} />

      <TableComponent
        columns={columns as any}
        data={data}
        placeholder="blogs"
        onAddClick={() => {}}
        showSearch={true}
        searchKeys={["title", "slug"]}
        showCreate
        isLoading={searchMutation.isLoading}
        canA={null}
        canI={null}
      />
    </>
  );
};

export default BlogsManagementPage;
