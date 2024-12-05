import LoadingList from "../../../components/loading/listes/loadingList";

export default function DaysOFF() {
  return (
    <div className="col-lg-4 mt-4">
      <div className="card h-100">
        <div className="card-header pb-0 p-3">
          <div className="row">
            <div className="col-12 d-flex align-items-center justify-content-center">
              <h6 className="mb-0">Feuille de style</h6>
            </div>
          </div>
        </div>
        <div
          className="card-body p-3 pb-0 "
          style={{ overflow: "scroll", height: "250px" }}
        >
          <ul className="list-group">
            <LoadingList />
          </ul>
        </div>
      </div>
    </div>
  );
}
