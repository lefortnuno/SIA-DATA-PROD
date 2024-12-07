import Template from "../../components/template/template";
import DaysOFF from "./joursFeries/joursFerie";
import Homie from "./homies/homie";
import Homie2 from "./homies/homie2";

export default function Home() {
  return (
    <Template>
      <div className="row mt-0">
        <DaysOFF />
        <Homie />
        <Homie2 />
      </div>
    </Template>
  );
}
