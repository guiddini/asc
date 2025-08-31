import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getBlogById } from "../../../apis";

const UpdateBlogPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryFn: () => getBlogById(id!),
    queryKey: ["blog", id],
    enabled: !!id,
  });
  console.log("blog data", data);
  return <div>UpdateBlogPage</div>;
};

export default UpdateBlogPage;
