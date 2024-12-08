import PieChart from "../../Charts/pie.chart";
import LineChart from "../../Charts/line.chart";

export default function Homie2() {
  return (
    <div className="col-lg-12 mt-4">
      <div className="row">
        <div className="col-xl-8 mb-xl-0 mb-4 text-start">
          <div
            className="card shadow-xl"
            style={{
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <LineChart />
          </div>
        </div>

        <div className="col-xl-4">
          <PieChart />
        </div>

        <div className="col-xl-3">
          <div className="mt-4 card "></div>
        </div>
      </div>
    </div>
  );
}
