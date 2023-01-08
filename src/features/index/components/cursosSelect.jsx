import React from "react";
import { useGetCursosQuery } from "../../../api/apiSlice.ts";

/**
 * Retorna um <select> com todos os cursos cadastrados no sistema, categorizados pelos seus campus.
 * @param {object} props
 * @param {React.ChangeEventHandler<HTMLSelectElement>|undefined} props.onChange
 */
export const CursosSelect = ({ onChange }) => {
  const { data: campi } = useGetCursosQuery();

  return (
    <select onChange={onChange}>
      {campi &&
        Object.keys(campi).map((campus) => {
          return (
            <optgroup key={campus} label={campus}>
              {campi[campus].map((curso) => {
                return (
                  <option key={curso.cursoId} value={curso.cursoId}>
                    {curso.cursoNome}
                  </option>
                );
              })}
            </optgroup>
          );
        })}
    </select>
  );
};
