import LoadingList from "../../../components/loading/listes/loadingList";
import eBoa from "../../../assets/images/dodgeRed.png";
import { BsWifi, BsBank, BsPaypal, BsPlus, BsPencil } from "react-icons/bs";
import CapteursPieChart from "../../capteurs/capteurs.pieChart";
export default function DaysOFF() {
  return (
    <div className="col-lg-4 mt-4">
      <div className="col-xl-12 mb-xl-0 mb-4 text-start">
        <div className="card bg-transparent shadow-xl">
          <div
            className="overflow-hidden position-relative border-radius-xl"
            style={{
              backgroundImage: `url(${eBoa})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span
              className="position-absolute w-100 h-100"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            ></span>
            <div className="card-body position-relative z-index-2 p-3">
              <BsWifi className="text-white pt-2" size={35} />
              <h5 className="text-white mt-2 mb-5 pt-2 pb-2">
                Domestic. Not domesticated
              </h5>
              <div className="d-flex">
                <div className="d-flex">
                  <div className="me-4">
                    <p className="text-white text-sm opacity-8 mb-0">Agence</p>
                    <h6 className="text-white mb-0">Dodge City</h6>
                  </div>
                  <div>
                    <p className="text-white text-sm opacity-8 mb-0">Ville</p>
                    <h6 className="text-white mb-0">Minnesota</h6>
                  </div>
                </div>
                <div className="ms-auto w-20 d-flex align-items-end justify-content-end text-white">
                  301
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 card " style={{ maxHeight: "23vh" }}>
        <div className="card-header pb-0 p-3">
          <div className="row">
            <div className="col-12 d-flex align-items-center justify-content-center">
              <h6 className="mb-0">Feuille de style</h6>
            </div>
          </div>
        </div>
        <div
          className="card-body p-3 pb-0 overflow-hidden"
          style={{ height: "250px" }}
        >
          <ul className="list-group">
            <LoadingList />
          </ul>
        </div>
      </div>
    </div>
  );
}
