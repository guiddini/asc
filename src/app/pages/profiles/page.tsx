import { useParams } from "react-router-dom";
import Hero from "./_components/hero";
import EventInfo from "./_components/event-info";
import Agenda from "./_components/agenda";
import Gallery from "./_components/gallery";
import Description from "./_components/description";
import { useQuery } from "react-query";
import { showSideEventBySlug } from "../../apis/side-event";

export interface Event {
  slug: string;
  title: string;
  description: string;
  date: string;
  gallery: string[];
  info: string;
  hero: string;
  location: string;
  website: string;
  email: string;
  cta?: string;
  organizers: string[];
  onClick: () => void;
  showIcon?: boolean;
  cta2?: string;
  onClick2?: () => void;
  logo?: string;
}

const EntityProfilePage = () => {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryFn: () => showSideEventBySlug(slug as string),
    enabled: !!slug,
    queryKey: ["showSideEventBySlug", slug],
  });

  return (
    <div className="w-100 h-100">
      <Hero event={data} />
      <div className="profile-container">
        <div id="page-content">
          <Description event={data} />
          {/* <Agenda /> */}
          <Gallery event={data} />
        </div>
        <div className="sticky-container">
          <EventInfo event={data} />
        </div>
      </div>
    </div>
  );
};

export { EntityProfilePage };
