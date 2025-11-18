import { useMemo, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Spinner, Row, Col } from "react-bootstrap";
import { getAcceptedPitchDecks } from "../../../apis/pitch-deck";
import { PitchDeckWithRelations } from "../../../types/pitch-deck";
import PitchDeckCard from "./pitch-deck-card";
import { getCountriesApi } from "../../../apis/rsources";
import { getAllCompaniesApi } from "../../../apis";

const PitchDeckList = () => {
  const [companyId, setCompanyId] = useState<string>("");
  const [countryId, setCountryId] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [queryParams, setQueryParams] = useState<{
    company_id: string;
    country_id: string;
    search: string;
  }>({
    company_id: companyId,
    country_id: countryId,
    search,
  });

  useEffect(() => {
    const t = setTimeout(() => {
      setQueryParams({
        company_id: companyId,
        country_id: countryId,
        search,
      });
    }, 400);
    return () => clearTimeout(t);
  }, [companyId, countryId, search]);

  const { data: companiesRes } = useQuery(["companies-all"], async () => {
    const res = await getAllCompaniesApi();
    return res.data;
  });

  const companies: { id: string; name: string }[] = useMemo(() => {
    const raw = Array.isArray(companiesRes)
      ? companiesRes
      : companiesRes?.data || [];
    return (raw || []).map((c: any) => ({
      id: String(c?.id || ""),
      name: String(c?.name || ""),
    }));
  }, [companiesRes]);

  const { data: countriesRes } = useQuery(["countries-all"], async () => {
    const res = await getCountriesApi();
    return res.data;
  });

  const countries: { id: string; name: string }[] = useMemo(() => {
    const raw = countriesRes?.data || countriesRes || [];
    return (raw || []).map(
      (willaya: { id: string; name_en: string; name_fr?: string }) => ({
        id: String(willaya.id || ""),
        name: String(willaya.name_en || willaya.name_fr || ""),
      })
    );
  }, [countriesRes]);

  const { data, isLoading, isError } = useQuery(
    [
      "accepted-pitch-decks",
      queryParams.company_id,
      queryParams.country_id,
      queryParams.search,
    ],
    async () => {
      const res = await getAcceptedPitchDecks({
        company_id: queryParams.company_id || undefined,
        country_id: queryParams.country_id || undefined,
        search: queryParams.search || undefined,
      });
      return res;
    },
    { keepPreviousData: true }
  );

  // Cleaned: simpler decks extraction without useMemo
  const decks: PitchDeckWithRelations[] = Array.isArray(data)
    ? (data as PitchDeckWithRelations[])
    : ((data as any)?.data || []);

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-10">
        <Spinner animation="border" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger">Failed to load pitch decks.</div>
    );
  }

  // Removed the early return that hid filters when no results
  // if (!decks.length) {
  //   return (
  //     <div className="alert alert-info">No accepted pitch decks available.</div>
  //   );
  // }

  // Filters bar
  return (
    <>
      <div className="card mb-6">
        <div className="card-body p-6">
          <Row className="g-4">
            <Col xs={12} md={4}>
              <label htmlFor="accepted-search" className="form-label mb-2">
                Search
              </label>
              <input
                id="accepted-search"
                type="text"
                className="form-control form-control-solid"
                placeholder="Search by title or uploader"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col xs={12} md={4}>
              <label htmlFor="accepted-company" className="form-label mb-2">
                Company
              </label>
              <select
                id="accepted-company"
                className="form-select form-select-solid"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
              >
                <option value="">All companies</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Col>
            <Col xs={12} md={4}>
              <label htmlFor="accepted-country" className="form-label mb-2">
                Country
              </label>
              <select
                id="accepted-country"
                className="form-select form-select-solid"
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
              >
                <option value="">All countries</option>
                {countries.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </Col>
          </Row>
        </div>
      </div>

      <Row className="g-6">
        {decks.map((deck) => (
          <Col key={deck.id} xs={12} md={6} lg={4}>
            <PitchDeckCard deck={deck} />
          </Col>
        ))}

        {decks.length === 0 && (
          <Col xs={12}>
            <div className="alert alert-info">
              No accepted pitch decks available.
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};

export default PitchDeckList;
