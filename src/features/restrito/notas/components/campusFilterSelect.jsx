import { useGetCampusQuery } from "../../../../api/apiSlice.ts";

export const CampusFilterSelect = ({ onChange = (value) => {} }) => {
  const campusQuery = useGetCampusQuery();

  return (
    <select defaultValue={-1} onChange={(ev) => onChange(parseInt(ev.target.value))}>
      <option value={-1}>Todos os campus</option>

      {campusQuery.isSuccess &&
        campusQuery.data.map((campus) => {
          return (
            <option key={campus.id} value={campus.id}>
              {campus.nome}
            </option>
          );
        })}
    </select>
  );
};
