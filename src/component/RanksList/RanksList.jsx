import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./ranksList.css";

import bronze from "../../assets/bronze.png";
import silver from "../../assets/silver2.png";
import normal from "../../assets/silver.png";
import gold from "../../assets/gold.png";
import winner from "../../assets/winner.png";
import box from "../../assets/box.png";

import { useNavigate } from "react-router-dom";
import OfferMessage from "../Modals/OfferMessage/OfferMessage";

import {
  createOffer,
  getOffersForWorkshop,
  getRanksAdmin,
  offersApi,
} from "../../api/offers";

const OFFERS_PAGE_SIZE = 10;

function getPages(current, total) {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const arr = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    out.push(arr[i]);
    if (i < arr.length - 1 && arr[i + 1] - arr[i] > 1) out.push("...");
  }
  return out;
}

const RANK_NAME_TO_ID = {
  عادي: 0,
  "المستوى العادي": 0,

  برونزي: 1,
  "المستوى البرونزي": 1,

  فضي: 2,
  "المستوى الفضي": 2,

  ذهبي: 3,
  "المستوى الذهبي": 3,

  بلاتيني: 4,
  البالاتيني: 4,
  البلاتيني: 4,
  "المستوى البلاتيني": 4,
};

const RANK_META = {
  0: { title: "المستوى العادي", visits: 1, img: normal },
  1: { title: "المستوى البرونزي", visits: 2, img: bronze },
  2: { title: "المستوى الفضي", visits: 3, img: silver },
  3: { title: "المستوى الذهبي", visits: 4, img: gold },
  4: { title: "المستوى البلاتيني", visits: 5, img: winner, highlight: true },
};

const rankLabelFromId = (rankId) => {
  if (rankId === 0) return "عادي";
  if (rankId === 1) return "برونزي";
  if (rankId === 2) return "فضي";
  if (rankId === 3) return "ذهبي";
  return "بلاتيني";
};

const imgFromRankId = (rankId) => {
  if (rankId === 0) return normal;
  if (rankId === 1) return bronze;
  if (rankId === 2) return silver;
  if (rankId === 3) return gold;
  return winner;
};

const RanksList = () => {
  const navigate = useNavigate();

  const [ranks, setRanks] = useState([]);
  const [ranksLoading, setRanksLoading] = useState(true);
  const [ranksError, setRanksError] = useState("");

  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [offersError, setOffersError] = useState("");

  const [showOfferAlert, setShowOfferAlert] = useState(false);
  const [selectedRank, setSelectedRank] = useState(null); 
  const [isSending, setIsSending] = useState(false);

  const [offersPage, setOffersPage] = useState(1);

  const workshopId = localStorage.getItem("workshopId");

  const loadRanks = useCallback(async () => {
    try {
      setRanksLoading(true);
      setRanksError("");

      const list = await getRanksAdmin({ lang: "ar" });

      const mapped = (list || []).map((r, idx) => {
        const name = r.name ?? "";
        const rankId = RANK_NAME_TO_ID[name] ?? idx; 

        const meta = RANK_META[rankId] || {};
        return {
          id: rankId,
          rankId,
          backendName: name,
          title: meta.title || name || `الرتبة ${idx + 1}`,
          visits: meta.visits ?? 0,
          clients: r.numberOfUsers ?? 0,
          img: meta.img || imgFromRankId(rankId),
          highlight: Boolean(meta.highlight),
        };
      });

      mapped.sort((a, b) => a.rankId - b.rankId);

      setRanks(mapped);
    } catch (err) {
      setRanksError(offersApi.getErrorMessage(err));
      setRanks([]);
    } finally {
      setRanksLoading(false);
    }
  }, []);

  const loadOffers = useCallback(async () => {
    try {
      setLoadingOffers(true);
      setOffersError("");

      if (!workshopId) {
        setOffers([]);
        setOffersError("لا يمكن تحميل العروض بدون workshopId");
        return;
      }

      const list = await getOffersForWorkshop({ workshopId });

      const mapped = (list || []).map((o, idx) => {
        const rankId = o.rank ?? 0;
        return {
          id: `${o.message}-${rankId}-${idx}`,
          title: o.message ?? "",
          rankId,
          rank: rankLabelFromId(rankId),
          img: imgFromRankId(rankId),
          raw: o,
        };
      });

      mapped.reverse();
      setOffers(mapped);
      setOffersPage(1);
    } catch (err) {
      setOffersError(offersApi.getErrorMessage(err));
      setOffers([]);
      setOffersPage(1);
    } finally {
      setLoadingOffers(false);
    }
  }, [workshopId]);

  useEffect(() => {
    loadRanks();
  }, [loadRanks]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const offersTotalPages = useMemo(
    () => Math.max(1, Math.ceil(offers.length / OFFERS_PAGE_SIZE)),
    [offers.length]
  );

  const pagedOffers = useMemo(() => {
    const start = (offersPage - 1) * OFFERS_PAGE_SIZE;
    return offers.slice(start, start + OFFERS_PAGE_SIZE);
  }, [offers, offersPage]);

  const goToOffersPage = (p) => {
    const next = Math.min(Math.max(1, p), offersTotalPages);
    setOffersPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isEmpty =
    ranks.length === 0 &&
    offers.length === 0 &&
    !ranksLoading &&
    !loadingOffers &&
    !ranksError &&
    !offersError;

  return (
    <div className="mainContainer">
      <OfferMessage
        show={showOfferAlert}
        onCancel={() => setShowOfferAlert(false)}
        confirmText={isSending ? "جاري الإرسال..." : "إرسال"}
        onConfirm={async (offerMessage) => {
          if (!selectedRank) return;

          try {
            setIsSending(true);

            const payload = {
              message: offerMessage,
              rank: selectedRank.rankId,
            };

            const res = await createOffer(payload);
            if (res?.success === false) return;

            setOffers((prev) => [
              {
                id: `local-${Date.now()}`,
                title: offerMessage,
                rankId: payload.rank,
                rank: rankLabelFromId(payload.rank),
                img: imgFromRankId(payload.rank),
              },
              ...prev,
            ]);

            setOffersPage(1);
            setShowOfferAlert(false);
          } catch (err) {
            setOffersError(offersApi.getErrorMessage(err));
          } finally {
            setIsSending(false);
          }
        }}
      />

      {isEmpty ? (
        <div className="emptyState">
          <img src={box} alt="no data" className="emptyIcon" />
          <p className="emptyText">لا يوجد عملاء لتصنيفهم حالياً.</p>
          <p className="emptySubText">
            لما تبدأ تضيف عملاء وتسجل زياراتهم، النظام هيصنفهم تلقائياً.
          </p>
          <div className="emptyBtns">
            <button
              className="addBtn"
              style={{ backgroundColor: "#DD2912", color: "white" }}
              onClick={() => navigate("/clients/add")}
            >
              إضافة عميل
            </button>
            <button
              className="addBtn"
              style={{ backgroundColor: "#DD2912", color: "white" }}
              onClick={() => navigate("/visits/add")}
            >
              إضافة زيارة
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="ranksGrid">
            {ranksLoading && (
              <p style={{ padding: 12 }}>جاري تحميل المستويات...</p>
            )}

            {!!ranksError && (
              <div style={{ padding: 12 }}>
                <p style={{ color: "red" }}>{ranksError}</p>
                <button className="addBtn" onClick={loadRanks}>
                  إعادة المحاولة
                </button>
              </div>
            )}

            {!ranksLoading &&
              !ranksError &&
              ranks.map((rank) => (
                <div
                  key={rank.id}
                  className={`rankCard ${rank.highlight ? "activeCard" : ""}`}
                >
                  <div className="rankHeader">
                    <span className="cardTitle">{rank.title}</span>
                    <div className="rankIcon">
                      <img src={rank.img} alt="" className="rankImg" />
                    </div>
                  </div>

                  <div className="rankInfo">
                    <span className="subText">{rank.visits} زيارات</span>
                    <span className="subTextb">{rank.clients} عميل</span>
                  </div>

                  <div className="rankHeader">
                    <span className="subTextb" />
                    <button
                      className="sendOfferBtn"
                      onClick={() => {
                        setSelectedRank(rank);
                        setShowOfferAlert(true);
                      }}
                    >
                      إرسال عرض
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="mainContainer roundedSection">
            <p className="cardTitle">العروض المرسلة</p>

            {loadingOffers && (
              <p style={{ padding: 12 }}>جاري تحميل العروض...</p>
            )}

            {!!offersError && (
              <div style={{ padding: 12 }}>
                <p style={{ color: "red" }}>{offersError}</p>
                <button className="addBtn" onClick={loadOffers}>
                  إعادة المحاولة
                </button>
              </div>
            )}

            {!loadingOffers && !offersError && pagedOffers.length === 0 && (
              <p style={{ padding: 12 }}>لا توجد عروض مرسلة.</p>
            )}

            {!loadingOffers &&
              !offersError &&
              pagedOffers.map((offer) => (
                <div className="mainCard" key={offer.id}>
                  <span>
                    <img src={offer.img} className="cardImg" alt="" />
                  </span>

                  <div className="cardCol">
                    <div className="cardRow">
                      <div>
                        <p className="cardTitle">{offer.title}</p>
                      </div>

                      <div>
                        <p className="cardTitle sentOfferBadge">{offer.rank}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {!loadingOffers && !offersError && offersTotalPages > 1 && (
              <div className="pager">
                <button
                  className="pagerArrow"
                  disabled={offersPage === 1}
                  onClick={() => goToOffersPage(offersPage - 1)}
                >
                  ‹
                </button>

                <div className="pagerNums">
                  {getPages(offersPage, offersTotalPages).map((p, idx) =>
                    p === "..." ? (
                      <span key={`dots-${idx}`} className="pagerDots">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        className={`pagerNum ${
                          offersPage === p ? "active" : ""
                        }`}
                        onClick={() => goToOffersPage(p)}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  className="pagerArrow"
                  disabled={offersPage === offersTotalPages}
                  onClick={() => goToOffersPage(offersPage + 1)}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RanksList;
