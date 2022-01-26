import { Estimation } from "@prisma/client";
import { toast } from "react-toastify";
import { TicketToCreate } from "../../../../pages/api/tickets/[projectId]";
import { EstimatedRow } from "../../../types/datasheet";
import wretch from "wretch";
import { ROOT_URL } from "../../../constants";

export const createTickets = async (
  estimation: Estimation,
  rows: EstimatedRow[],
  epics: { label: string; value: string }[],
  gestures: { label: string; value: string }[]
) => {
  const tickets: TicketToCreate[] = [];
  rows.forEach((row) => {
    row.gestures.forEach((gesture) => {
      if (!row.id) {
        toast("Enregistrer l'estimation avant de générer les tickets", {
          type: "error",
        });
        return;
      }

      const ticket: TicketToCreate = {
        epic: {
          id: row.epic,
          name:
            epics.find((epic) => epic.value === row.epic)?.label ?? "No name",
        },
        feature: { id: row.id, name: row.feature },
        name:
          gestures.find((gest) => gest.value === gesture)?.label || "Ticket",
      };

      tickets.push(ticket);
    });
  });

  await wretch(`${ROOT_URL}/tickets/${estimation.projectId}`).post({ tickets });
};
