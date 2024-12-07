import CapteursPieChart from "../../capteurs/capteurs.pieChart";
import CapteursLineChart from "../../capteurs/capteurs.lineChart";
import GanttChart from "../../productions/productions.ganttChart";
import LoadingList from "../../../components/loading/listes/loadingList";

export default function Homie() {
  return (
    <div className="col-lg-8 mt-4">
      <div className="row">
        <div className="col-md-12 mb-lg-0 mb-4">
          <GanttChart />
        </div> 
      </div>
    </div>
  );
}
