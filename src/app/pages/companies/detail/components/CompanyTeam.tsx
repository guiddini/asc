import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { Carousel, Spinner } from "react-bootstrap";
import { getAllCompanyStaffApi } from "../../../../apis";
import TeamCard from "./team-card";

interface CompanyTeamProps {
  companyId: string;
}

const CompanyTeam: React.FC<CompanyTeamProps> = ({ companyId }) => {
  const { data: staff, isLoading: loadingStaff } = useQuery(
    ["get-all-company-staff", companyId],
    () => getAllCompanyStaffApi(companyId)
  );

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth < 768;

  const COMPANY_STAFF = useMemo(() => {
    if (!staff) {
      return [];
    }

    const itemsPerRow = isMobile ? 1 : 3;

    const groupedStaff = [];
    for (let i = 0; i < staff.data.length; i += itemsPerRow) {
      groupedStaff.push(staff.data.slice(i, i + itemsPerRow));
    }

    return groupedStaff;
  }, [staff, isMobile]);

  if (loadingStaff) {
    return (
      <div
        style={{
          height: "80vh",
        }}
        className="w-100 d-flex flex-column justify-content-center align-items-center bg-light"
      >
        <Spinner animation="border" color="#000" />
        <span className="mt-3">Loading team</span>
      </div>
    );
  }

  return (
    <>
      {COMPANY_STAFF?.length > 0 && (
        <div className="mb-18">
          <div className="text-center mb-12">
            <h3 className="fs-2hx text-dark mb-5">Our Team</h3>
          </div>
          <Carousel
            id="company-staff-carousel"
            style={{
              accentColor: "#000",
            }}
            nextIcon={<i className="fa-solid fa-chevron-right text-black fs-1"></i>}
            prevIcon={<i className="fa-solid fa-chevron-left text-black fs-1"></i>}
          >
            {COMPANY_STAFF.map((staffGroup, index) => (
              <Carousel.Item key={index}>
                <div className="w-75 mx-auto d-flex flex-row align-items-center justify-content-center gap-10">
                  {staffGroup.map((individualStaff, i) => (
                    <TeamCard
                      key={i}
                      id={individualStaff?.user_id}
                      logo={individualStaff?.data?.avatar}
                      name={
                        individualStaff?.data?.fname +
                        " " +
                        individualStaff?.data?.lname
                      }
                      role={
                        individualStaff?.data?.roles &&
                        individualStaff?.data?.roles[0]?.display_name
                      }
                    />
                  ))}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}
    </>
  );
};

export default CompanyTeam;
