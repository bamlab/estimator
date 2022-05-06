import { Button } from "@nextui-org/react";
import { Delete } from "react-iconly";

export const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return <Button auto onClick={onClick} icon={<Delete />} />;
};
