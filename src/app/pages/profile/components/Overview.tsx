import { useEffect, useMemo, useState } from "react";
import TimelineBox from "../../home/components/timeline-box";
import { useParams } from "react-router-dom";
import { getAllPostsApi, getUserPostsApi } from "../../../apis";
import { PostType } from "../../../types/posts";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import PostBox from "../../home/components/post-box";
import { useDispatch, useSelector } from "react-redux";
import { PostsReducer } from "../../../types/reducers";
import { initPosts } from "../../../features/postsSlice";
import { User } from "../../../types/user";

export function Overview({ user }: { user: User }) {
  const { id } = useParams();

  const dispatch = useDispatch();

  const POSTS = useSelector((state: PostsReducer) => state.posts?.posts);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const posts = await getAllPostsApi({
          offset: 0,
        });
        dispatch(initPosts(posts?.data));
      } catch (error) {}
    };

    if (POSTS.length === 0) {
      getPosts();
    }
  }, []);

  const USER_POSTS = useMemo(() => {
    return POSTS.filter((post) => post?.user_id === id);
  }, [id, POSTS]);

  return (
    <div className="row g-5 g-xxl-8">
      <div className="col-xl-6">
        {USER_POSTS?.length > 0 ? (
          <>
            {USER_POSTS?.map((post: PostType) => (
              <PostBox {...post} key={post?.id} />
            ))}
          </>
        ) : (
          <div className="bg-white w-100 h-400px d-flex flex-column align-items-center justify-content-center">
            <img
              src={toAbsoluteUrl("/media/svg/illustrations/easy/9.svg")}
              alt="no post found"
            />
            <span className="text-muted mt-1 fw-semibold fs-4">
              Cet utilisateur n'a encore partagé aucune publication
            </span>
          </div>
        )}
      </div>

      <div className="col-xl-6">
        <div className="card mb-2">
          <div className="card-body">
            <h3 className="mb-4">Centre d'intérêt :</h3>
            <div className="d-flex flex-wrap flex-row align-items-center fw-bold gap-4">
              {user?.activity_areas?.map((a, index) => (
                <span
                  key={index}
                  className={`badge fs-6 text-black p-2`}
                  style={{
                    background: "#00c4c4",
                  }}
                >
                  {a.label_fr}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-5 mb-xxl-8">
          <TimelineBox />
        </div>

        {/* <ListsWidget2 className="mb-5 mb-xxl-8" /> */}
      </div>
    </div>
  );
}
