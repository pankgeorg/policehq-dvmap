import { Popup } from "react-leaflet";
import { type PoliceDepartment } from "../../hooks/usePoliceDepartmentLocationDataHook";

export const DepartmentTemplate = ({
  department,
}: {
  department?: PoliceDepartment;
}) => {
  console.log(department);
  if (!department) return null;
  return (
    <div>
      <strong>
        {department.id}: {department["ΔΙΕΥΘΥΝΣΗ ΑΣΤΥΝΟΜΙΑΣ"]}
      </strong>
      <br />
      Διεύθυνση: {department["ΔΙΕΥΘΥΝΣΗ"]}
      <br />
      <a target="_blank" href={department["Google Maps Link"]}>
        Χάρτης🗺️{" "}
      </a>{" "}
      <br />
      Τηλέφωνο:{" "}
      <a target="_blank" href={`tel:0030${department["ΤΗΛΕΦΩΝΟ"]}`}>
        📱 {department["ΤΗΛΕΦΩΝΟ"]}
      </a>
      <br />
      <a target="_blank" href={`mailto:${department["email"]}`}>
        Email📧{department["email"]}
      </a>
    </div>
  );
};

export const OfficePopup = ({
  department,
}: {
  department: PoliceDepartment;
}) => {
  return (
    <Popup>
      <DepartmentTemplate department={department} key={department.email} />
    </Popup>
  );
};
