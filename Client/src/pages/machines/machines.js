import axios from "../../contexts/api/axios";
import eventEmitter from "../../contexts/api/eventEmitter";
import { formatDate } from "../../contexts/dates/formatDate";

import Template from "../../components/template/template";
import Pagination from "../../components/pagination/pagination";
import LoadingTable from "../../components/loading/tables/loadingTable";
import MachinesBarChart from "./machines.barChart";

import { useEffect, useState } from "react";

import "./machines.css";

const url_req = `machines/`;
const histoPerPage = 5;

export default function Machines() {
  const [histo, setHisto] = useState([]);
  const [barChart, setBarChart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getHisto();
    const handleMAJ = () => getHisto();

    eventEmitter.on("miseAJour", handleMAJ);
    return () => {
      eventEmitter.off("miseAJour", handleMAJ); // Nettoyer l'écouteur
    };
  }, []);

  useEffect(() => {
    // getBarChart();

    const intervalId = setInterval(() => {
      getBarChart();
    }, 1000);
    return () => clearInterval(intervalId);
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

  function getBarChart() {
    axios
      .get(url_req + `barChart/`)
      .then(function (response) {
        if (
          response.status === 200 &&
          response.data.success &&
          response.data.data.length > 0
        ) {
          const allHisto = response.data.data;
          setBarChart(allHisto);
        } else {
          setBarChart([]);
        }
      })
      .catch((error) => {
        setBarChart([]);
      });
  }

  const indexOfLastService = currentPage * histoPerPage;
  const indexOfFirstService = indexOfLastService - histoPerPage;
  const currentHisto = histo.slice(indexOfFirstService, indexOfLastService);

  return (
    <Template>
      <main className="col-md-12 ms-sm-auto col-lg-12 px-md-4 mt-0 main">
        {barChart.length > 0 && <MachinesBarChart data={barChart} />}
        <div className="pt-3 pb-2 mb-3">
          <div className="text-center my-3 mt-0">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h5 className="mb-0 me-2 position-relative d-inline-block">
                  Listes des machines :<span className="green-underline"></span>
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
                  <th>ID</th>
                  <th>Libelle</th>
                  <th>Date de maintenance </th>
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
                          <td>{s.id_machine}</td>
                          <td>{s.libelle_machine}</td>
                          <td>{formatDate(s.date_maintenance)}</td>
                          <td>{s.etat ? "Panne" : "Disponible"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10">Aucune donnée disponible</td>
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
