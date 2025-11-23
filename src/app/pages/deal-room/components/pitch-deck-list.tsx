import { useMemo, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Spinner, Row, Col } from "react-bootstrap";
import { getAcceptedPitchDecks } from "../../../apis/pitch-deck";
import { PitchDeckWithRelations } from "../../../types/pitch-deck";
import PitchDeckCard from "./pitch-deck-card";
import { getCountriesApi } from "../../../apis/rsources";

import {
  ACTIVITY_SECTOR_OPTIONS,
  INVESTMENT_CATEGORY_OPTIONS,
  MATURITY_LEVEL_OPTIONS,
} from "../../../data/pitch-deck";

const PitchDeckList = () => {
  const [countryId, setCountryId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [investmentCategory, setInvestmentCategory] = useState<string>("");
  const [maturityLevel, setMaturityLevel] = useState<string>("");
  const [activitySector, setActivitySector] = useState<string>("");
  const [yearOfCreation, setYearOfCreation] = useState<string>("");
  const [revenue2024, setRevenue2024] = useState<string>("");
  const [usersCount, setUsersCount] = useState<string>("");
  const [employeesCount, setEmployeesCount] = useState<string>("");
  const [requestedAmountUsd, setRequestedAmountUsd] = useState<string>("");

  const [queryParams, setQueryParams] = useState<{
    country_id: string;
    search: string;
    investment_category: string;
    maturity_level: string;
    activity_sectors: string;
    year_of_creation: string;
    revenue_2024: string;
    users_count: string;
    employees_count: string;
    requested_amount_usd: string;
  }>({
    country_id: countryId,
    search,
    investment_category: investmentCategory,
    maturity_level: maturityLevel,
    activity_sectors: activitySector,
    year_of_creation: yearOfCreation,
    revenue_2024: revenue2024,
    users_count: usersCount,
    employees_count: employeesCount,
    requested_amount_usd: requestedAmountUsd,
  });

  useEffect(() => {
    const t = setTimeout(() => {
      setQueryParams({
        country_id: countryId,
        search,
        investment_category: investmentCategory,
        maturity_level: maturityLevel,
        activity_sectors: activitySector,
        year_of_creation: yearOfCreation,
        revenue_2024: revenue2024,
        users_count: usersCount,
        employees_count: employeesCount,
        requested_amount_usd: requestedAmountUsd,
      });
    }, 400);
    return () => clearTimeout(t);
  }, [
    countryId,
    search,
    investmentCategory,
    maturityLevel,
    activitySector,
    yearOfCreation,
    revenue2024,
    usersCount,
    employeesCount,
    requestedAmountUsd,
  ]);

  const { data: countriesRes } = useQuery(["countries-all"], async () => {
    const res = await getCountriesApi();
    return res.data;
  });

  const countries: { id: string; name: string }[] = useMemo(() => {
    const raw = countriesRes?.data || countriesRes || [];
    return (raw || []).map((willaya: { id: string; name_en: string }) => ({
      id: String(willaya.id || ""),
      name: String(willaya.name_en || ""),
    }));
  }, [countriesRes]);

  const { data, isLoading, isError } = useQuery(
    [
      "accepted-pitch-decks",
      queryParams.country_id,
      queryParams.search,
      queryParams.investment_category,
      queryParams.maturity_level,
      queryParams.activity_sectors,
      queryParams.year_of_creation,
      queryParams.revenue_2024,
      queryParams.users_count,
      queryParams.employees_count,
      queryParams.requested_amount_usd,
    ],
    async () => {
      const res = await getAcceptedPitchDecks({
        search: queryParams.search || undefined,
        investment_category: queryParams.investment_category || undefined,
        maturity_level: queryParams.maturity_level || undefined,
        country_id: queryParams.country_id
          ? Number(queryParams.country_id)
          : undefined,
        activity_sectors: queryParams.activity_sectors || undefined,
        year_of_creation: queryParams.year_of_creation
          ? Number(queryParams.year_of_creation)
          : undefined,
        revenue_2024: queryParams.revenue_2024
          ? Number(queryParams.revenue_2024)
          : undefined,
        users_count: queryParams.users_count
          ? Number(queryParams.users_count)
          : undefined,
        employees_count: queryParams.employees_count
          ? Number(queryParams.employees_count)
          : undefined,
        requested_amount_usd: queryParams.requested_amount_usd
          ? Number(queryParams.requested_amount_usd)
          : undefined,
      } as any);
      return res;
    },
    { keepPreviousData: true }
  );

  // Cleaned: simpler decks extraction without useMemo
  const decks: PitchDeckWithRelations[] = Array.isArray(data)
    ? (data as PitchDeckWithRelations[])
    : (data as any)?.data || [];

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
              <label className="form-label mb-2">Investment Category</label>
              <select
                className="form-select form-select-solid"
                value={investmentCategory}
                onChange={(e) => setInvestmentCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {INVESTMENT_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Col>
            <Col xs={12} md={4}>
              <label className="form-label mb-2">Maturity Level</label>
              <select
                className="form-select form-select-solid"
                value={maturityLevel}
                onChange={(e) => setMaturityLevel(e.target.value)}
              >
                <option value="">All levels</option>
                {MATURITY_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Col>
          </Row>

          <Row className="g-4 mt-4">
            <Col xs={12} md={4}>
              <label className="form-label mb-2">Country</label>
              <select
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
            <Col xs={12} md={4}>
              <label className="form-label mb-2">Activity Sector</label>
              <select
                className="form-select form-select-solid"
                value={activitySector}
                onChange={(e) => setActivitySector(e.target.value)}
              >
                <option value="">All sectors</option>
                {ACTIVITY_SECTOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Col>
          </Row>

          <Row className="g-4 mt-4">
            <Col xs={12} md={4}>
              <label className="form-label mb-2">Year of Creation</label>
              <input
                type="number"
                className="form-control form-control-solid"
                value={yearOfCreation}
                onChange={(e) => setYearOfCreation(e.target.value)}
              />
            </Col>
            <Col xs={12} md={4}>
              <label className="form-label mb-2">Revenue 2024</label>
              <input
                type="number"
                className="form-control form-control-solid"
                value={revenue2024}
                onChange={(e) => setRevenue2024(e.target.value)}
              />
            </Col>
            <Col xs={12} md={4}>
              <label className="form-label mb-2">Users</label>
              <input
                type="number"
                className="form-control form-control-solid"
                value={usersCount}
                onChange={(e) => setUsersCount(e.target.value)}
              />
            </Col>
          </Row>

          <Row className="g-4 mt-4">
            <Col xs={12} md={6}>
              <label className="form-label mb-2">Employees</label>
              <input
                type="number"
                className="form-control form-control-solid"
                value={employeesCount}
                onChange={(e) => setEmployeesCount(e.target.value)}
              />
            </Col>
            <Col xs={12} md={6}>
              <label className="form-label mb-2">Requested Amount (USD)</label>
              <input
                type="number"
                className="form-control form-control-solid"
                value={requestedAmountUsd}
                onChange={(e) => setRequestedAmountUsd(e.target.value)}
              />
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
