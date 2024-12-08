import Template from "../../components/template/template";
import { useState } from "react";
import LeafletChartMaps from "../Charts/leaflet.chart";

import "./stat.css";

const url_req = process.env.REACT_APP_SUN_COMPLET_URL + `employee/`;

export default function Pointage() {
  const [modeAffichage, setModeAffichage] = useState(false);

  const handleModeAffichage = () => {
    setModeAffichage(!modeAffichage);
  };

  return (
    <Template>
      <main className="col-md-12 ms-sm-auto col-lg-12 px-md-4 main mt-2 pb-2">
        <div className="pt-3 pb-2 mb-3">
          <LeafletChartMaps />
        </div>
      </main>
    </Template>
  );
}
