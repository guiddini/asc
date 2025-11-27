import SuggestionBox from "./components/suggestion-box";
import TrendingBox from "./components/trending-box";
import ProfileBox from "./components/profile-box";
import PostBox from "./components/post-box";
import CreatePost from "./components/create-post";
import { useDispatch, useSelector } from "react-redux";
import { PostsReducer, UserResponse } from "../../types/reducers";
import { PostType } from "../../types/posts";
import { SponsorsBox } from "./components/sponsors-box";
import { useEffect, useRef, useState } from "react";
import {
  initPosts,
  loadMorePost,
  nextPage,
  prevPage,
} from "../../features/postsSlice";
import { getAllPostsApi } from "../../apis";
import { Col, Row, Spinner } from "react-bootstrap";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
import RoleGuard from "../../components/role-guard";
import UpdateUserIdentificationsModal from "../../components/update-user-identifications";
import { adminRoles } from "../../utils/roles";
import PitchDeckAlert from "./components/pitch-deck-alert";

const HomePage = () => {
  const dispatch = useDispatch();
  const [showUpdateIdentification, setShowUpdateIdentification] =
    useState(false);
  const { user } = useSelector((state: UserResponse) => state.user);
  const hasIdentification = user?.info?.has_identification;
  const kycStatus = user?.info?.kyc_status;

  const { currentPage, posts } = useSelector(
    (state: PostsReducer) => state.posts
  );

  useEffect(() => {
    const getPosts = async () => {
      try {
        const posts = await getAllPostsApi({
          offset: 0,
        });
        dispatch(initPosts(posts?.data));
        dispatch(nextPage());
      } catch (error) {}
    };
    getPosts();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const USER_POSTS = posts?.filter((post) => post.user_id === user?.id);

  const handleShowMore = async () => {
    if (posts.length > 0) {
      setIsLoading(true); // Set loading state

      try {
        const data = await getAllPostsApi({ offset: currentPage });
        const newPosts = data?.data;

        if (newPosts.length > 0) {
          dispatch(loadMorePost(newPosts)); // Dispatch with new posts
          dispatch(nextPage());
        }
      } catch (error) {
        console.error("Error while getting posts:", error);
        dispatch(prevPage());
        // Handle error
      }
    }
  };

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleShowMore();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [posts?.length]);

  return (
    <div className="content d-flex flex-column" id="">
      <div id="kt_content_container" className="w-100">
        {/* Dim the page when blocked, but keep it interactive */}
        <div className="d-flex flex-row" style={{}}>
          <div
            id="feed-left-container"
            className="d-lg-flex flex-column flex-lg-row-auto w-lg-325px"
            data-kt-drawer="true"
            data-kt-drawer-name="start-sidebar"
            data-kt-drawer-activate="{default: true, lg: false}"
            data-kt-drawer-overlay="true"
            data-kt-drawer-width="{default:'200px', '250px': '300px'}"
            data-kt-drawer-direction="start"
            data-kt-drawer-toggle="#kt_social_start_sidebar_toggle"
          >
            <ProfileBox postLength={USER_POSTS?.length} />

            <TrendingBox />
          </div>

          <div
            className="w-100 flex-lg-row-fluid mx-lg-13"
            id="home-feed-posts"
          >
            {/* KYC notice aligned with Badge page */}
            {kycStatus !== "accepted" && (
              <>
                <div
                  className={`notice d-flex align-items-center justify-content-between rounded border border-dashed p-4 mb-6 ${
                    kycStatus === "refused"
                      ? "bg-light-danger border-danger"
                      : "bg-light-warning border-warning"
                  }`}
                  role="alert"
                  aria-live="polite"
                >
                  <div className="d-flex align-items-center">
                    <div className="symbol symbol-35px me-4">
                      <span
                        className={`symbol-label ${
                          kycStatus === "refused"
                            ? "bg-light-danger"
                            : "bg-light-warning"
                        }`}
                      >
                        <KTIcon
                          iconName="notification"
                          className={`fs-2 ${
                            kycStatus === "refused"
                              ? "text-danger"
                              : "text-warning"
                          }`}
                        />
                      </span>
                    </div>
                    <div className="d-flex flex-column">
                      <span className="text-gray-900 fw-bold">
                        {kycStatus === "refused"
                          ? "KYC Refused — Access Denied"
                          : hasIdentification
                          ? "KYC Pending — Access Restricted"
                          : "Identification Required — No Access"}
                      </span>
                      <span className="text-muted fs-7">
                        {kycStatus === "refused"
                          ? "Your identification documents were refused. You must re‑upload valid documents. Until your KYC is accepted, you cannot enter the event venue, generate or print your badge, or access restricted features."
                          : hasIdentification
                          ? "Your documents are under review. Until KYC is accepted: no entry to the event venue, no badge generation/printing, and certain features remain locked."
                          : "You have not uploaded your passport or national ID. To attend the event, you must submit your identification for KYC. Without an accepted KYC, you cannot enter the venue or generate/print your badge."}
                      </span>
                    </div>
                  </div>
                  <div className="ms-5">
                    {(kycStatus === "refused" ||
                      (kycStatus === "pending" && !hasIdentification) ||
                      (!kycStatus && !hasIdentification)) && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowUpdateIdentification(true)}
                      >
                        {kycStatus === "refused"
                          ? "Upload Again"
                          : "Upload Now"}
                      </button>
                    )}
                  </div>
                </div>

                <UpdateUserIdentificationsModal
                  show={showUpdateIdentification}
                  onHide={() => setShowUpdateIdentification(false)}
                />
              </>
            )}
            {/* Pitch Deck alert & upload */}
            <RoleGuard
              allowedRoles={["participant", "exhibitor"]}
              exclusiveRoles={["participant", "exhibitor"]}
            >
              <PitchDeckAlert />
            </RoleGuard>

            <RoleGuard allowedRoles={adminRoles}>
              <CreatePost />
            </RoleGuard>
            <Row className="d-lg-none">
              <Col md={6}>
                <SponsorsBox />
                <TrendingBox />
              </Col>
            </Row>

            <>
              {posts?.length > 0 ? (
                <div className="mb-10" id="kt_social_feeds_posts">
                  {posts?.map((post: PostType) => (
                    <PostBox {...post} key={post?.id} />
                  ))}

                  {isLoading && (
                    <div className="w-100 d-flex align-items-center justify-content-center">
                      <Spinner
                        animation="border"
                        variant="secondary"
                        size="sm"
                      />
                    </div>
                  )}
                  {posts?.length >= 10 && <div ref={observerTarget}></div>}
                </div>
              ) : (
                <div className="bg-white w-100 h-400px d-flex flex-column align-items-center justify-content-center">
                  <img
                    src={toAbsoluteUrl("/media/svg/illustrations/easy/9.svg")}
                    alt="no post found"
                  />
                </div>
              )}
            </>
          </div>

          <div
            id="feed-right-container"
            className="d-lg-flex flex-column flex-lg-row-auto w-lg-325px"
            data-kt-drawer="true"
            data-kt-drawer-name="end-sidebar"
            data-kt-drawer-activate="{default: true, lg: false}"
            data-kt-drawer-overlay="true"
            data-kt-drawer-width="{default:'200px', '250px': '300px'}"
            data-kt-drawer-direction="end"
            data-kt-drawer-toggle="#kt_social_end_sidebar_toggle"
          >
            <div className="d-lg-block">
              <SponsorsBox />
            </div>
            <SuggestionBox />
            {/* <div className="d-lg-block">
              <TrendingBox />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export { HomePage };
