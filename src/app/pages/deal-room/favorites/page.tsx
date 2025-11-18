import React from "react";
import { useQuery } from "react-query";
import { Spinner, Row, Col } from "react-bootstrap";
import PitchDeckCard from "../components/pitch-deck-card";
import { myInvestorConnections } from "../../../apis/investor-connection";
import { PitchDeckWithRelations } from "../../../types/pitch-deck";

const FavoritePitchDeckPage = () => {
  const { data, isLoading, isError } = useQuery(
    ["my-investor-connections"],
    async () => {
      const res = await myInvestorConnections();
      return res;
    },
    {
      keepPreviousData: true,
      staleTime: 10 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  const decks: PitchDeckWithRelations[] = Array.isArray(data)
    ? (data as any)
    : (data as any)?.data || [];

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-10">
        <Spinner animation="border" />
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-danger">Failed to load favorites.</div>;
  }

  return (
    <Row className="g-6">
      {decks.map((deck) => (
        <Col key={deck?.id} xs={12} md={6} lg={4}>
          <PitchDeckCard
            deck={{
              ...deck,
              is_favorite: true,
            }}
          />
        </Col>
      ))}

      {decks.length === 0 && (
        <Col xs={12}>
          <div className="alert alert-info">No favorite pitch decks yet.</div>
        </Col>
      )}
    </Row>
  );
};

export default FavoritePitchDeckPage;
