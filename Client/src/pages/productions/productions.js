import axios from "../../contexts/api/axios";
import eventEmitter from "../../contexts/api/eventEmitter";
import { formatDate } from "../../contexts/dates/formatDate";

import Template from "../../components/template/template";
import Pagination from "../../components/pagination/pagination";
import LoadingTable from "../../components/loading/tables/loadingTable";
import ProductionGantt from "./productions.ganttChart";
import GanttChartVoiture from "./dodge.ganttChart";

import { useEffect, useState } from "react";

import "./productions.css";

const url_req = `productions/`;
const histoPerPage = 5;

export default function Productions() {
  const [histo, setHisto] = useState([]);
  const [prod, setProd] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getHisto();
  }, []);

  function getHisto() {
    axios
      .get(url_req)
      .then(function (response) {
        if (
          response.status === 200 &&
          response.data.success &&
          response.data.data.length > 0
        ) {
          const allHisto = response.data.data;
          setProd(allHisto[0]["produit"]);
          setHisto(allHisto);
          setTotalPages(Math.ceil(allHisto.length / histoPerPage));
        } else {
          setHisto([]);
          setTotalPages(1);
        }
      })
      .catch((error) => {
        setHisto([]);
      });
  }

  const indexOfLastService = currentPage * histoPerPage;
  const indexOfFirstService = indexOfLastService - histoPerPage;
  const currentHisto = histo.slice(indexOfFirstService, indexOfLastService);

  return (
    <Template>
      <main className="col-md-12 ms-sm-auto col-lg-12 px-md-4 mt-0 main">
        <GanttChartVoiture prod={prod} />
        <div className="pt-3 pb-2 mt-2 mb-3">
          <div className="text-center my-3 mt-0">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h5 className="mb-0 me-2 position-relative d-inline-block">
                  Listes des ordres de fabrication :
                  <span className="green-underline"></span>
                </h5>
              </div>
              <h5 className="mb-0 me-2 position-relative d-inline-block">
                Nombre :{" "}
                <span className="totaly">
                  {histo !== null && histo !== undefined ? histo.length : "0"}
                </span>
              </h5>
            </div>
          </div>

          <div className="table-responsive text-nowrap bg-white">
            <table className="table table-striped w-100">
              <thead>
                <tr>
                  <th>ID Commande</th>
                  <th>Produit</th>
                  <th>Date de lancement</th>
                  <th>Date de fin prévue</th>
                  <th>Progression</th>
                  <th>Etat</th>
                </tr>
              </thead>
              <tbody>
                {!histo ? (
                  <LoadingTable />
                ) : (
                  <>
                    {currentHisto.length > 0 ? (
                      currentHisto.map((s, key) => (
                        <tr key={key}>
                          <td>{s.id_fabrication}</td>
                          <td
                            onClick={() => setProd(s.produit)}
                            className="cursor-pointer"
                          >
                            {s.produit}
                          </td>
                          <td>{formatDate(s.date_lancement)}</td>
                          <td>{formatDate(s.date_fin_prevue)}</td>
                          <td>{s.progression_production}%</td>
                          <td>
                            {s.statut_fabrication ? "Complété" : "En cours"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">Aucune donnée disponible</td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </Template>
  );
}
