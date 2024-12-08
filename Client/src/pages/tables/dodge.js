import "./dodge.css";

export default function VoitureDodge({ picName }) {
  let imgName = "challenger2.png"; // Valeur par défaut si picName est invalide
  if (picName && picName.includes(".")) {
    imgName = picName.split(".")[1].toLowerCase() + ".png"; // Utilise la première partie (nom du fichier)
  }

  return (
    <div className="u-img-dodge">
      <img
        src={`${process.env.REACT_APP_SUN_COMPLET_URL}uploads/dodge/${imgName}`}
        alt="Dodge"
      />
    </div>
  );
}
