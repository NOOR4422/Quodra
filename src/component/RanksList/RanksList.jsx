import React, { useState } from "react";
import "./ranksList.css";

import bronze from "../../assets/bronze.png";
import silver from "../../assets/silver2.png";
import normal from "../../assets/silver.png";
import gold from "../../assets/gold.png";
import winner from "../../assets/winner.png";
import box from "../../assets/box.png";
import { useNavigate } from "react-router-dom";
import OfferMessage from "../OfferMessage/OfferMessage";
const RanksList = () => {
  const navigate = useNavigate();

  const [ranks, setRanks] = useState([
    {
      title: "المستوى العادي",
      clients: 10,
      visits: 1,
      img: normal,
    },
    {
      title: "المستوى البرونزي",
      clients: 20,
      visits: 2,
      img: bronze,
    },
    {
      title: "المستوى الفضي",
      clients: 20,
      visits: 3,
      img: silver,
    },
    {
      title: "المستوى الذهبي",
      clients: 20,
      visits: 4,
      img: gold,
    },
    {
      title: "المستوى البلاتيني",
      clients: 20,
      visits: 5,
      img: winner,
      highlight: true,
    },
  ]);

  const [offers, setOffers] = useState([
    {
      title: "خصم 20% على تغيير الزيت",
      rank: "ذهبي",
      img: gold,
    },
    {
      title: "فحص مجاني للفرامل",
      rank: " فضى",
      img: silver,
    },
    {
      title: "تنظيف داخلي مجاني للسيارة",
      rank: "برونزى",
      img: bronze,
    },
    {
      title: "خصم 10% على الغسيل الشامل",
      rank: "عادى",
      img: normal,
    },
  ]);

  const isEmpty = ranks.length === 0 && offers.length === 0;
const [showOfferAlert, setShowOfferAlert] = useState(false);
const [selectedRank, setSelectedRank] = useState(null);

  return (
    <div className="mainContainer">
      <OfferMessage
        show={showOfferAlert}
        onCancel={() => setShowOfferAlert(false)}
        onConfirm={() => {
          console.log("✔ Offer Sent To:", selectedRank?.title);
          setShowOfferAlert(false);
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
              onClick={() => navigate("/addVisitForm")}
            >
              إضافة زيارة
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="ranksGrid">
            {ranks.map((rank, index) => (
              <div
                key={index}
                className={`rankCard ${rank.highlight ? "activeCard" : ""}`}
              >
                <div className="rankHeader">
                  <span className="rankTitle">{rank.title}</span>
                  <div className="rankIcon">
                    <img src={rank.img} alt="" className="rankImg" />
                  </div>
                </div>

                <div className="rankInfo">
                  <span>{rank.visits} زيارات</span>
                </div>

                <div className="rankHeader">
                  <span>{rank.clients} عميل</span>
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
            <p className="sectionTitle ">العروض المرسلة</p>
            {offers.map((offer, index) => (
              <>
                <div className="mainCard" key={index}>
                  <span>
                    <img src={offer.img} className="cardImg" />
                  </span>
                  <div className="cardCol">
                    <div className="cardRow">
                      <div>
                        <p className="cardTitle"> {offer.title}</p>
                      </div>{" "}
                      <div>
                        <div className="">
                          <p className="cardTitle sentOfferBadge">
                            {" "}
                            {offer.rank}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RanksList;
