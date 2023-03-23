import { Dispatch, SetStateAction } from "react";
import { Button, Modal, Row, Spacer, Text } from "@nextui-org/react";

interface Props {
  isVisible: string;
  setIsVisible: Dispatch<SetStateAction<string>>;
  onDeleteConfirm: () => Promise<void>;
}

export const DeleteConfirmationModal: React.FC<Props> = ({
  isVisible,
  setIsVisible,
  onDeleteConfirm,
}) => {
  return (
    <Modal
      open={isVisible === "selected" || isVisible === "all"}
      onClose={() => setIsVisible("no")}
      width="500px"
    >
      <Modal.Header>
        <Text id="modal-title" size={18} weight="bold">
          Warning
        </Text>
      </Modal.Header>

      <Modal.Body>
        <Text css={{ textAlign: "center" }}>
          Sprint deletion is permanent, are you sure you want to continue?
        </Text>
        <Spacer y={0.5} />

        <Row justify="space-between">
          <Button
            style={BackButton}
            onPress={() => {
              setIsVisible("no");
            }}
          >
            {"Cancel"}
          </Button>
          <Spacer x={2} />
          <Button
            style={DeleteButton}
            onPress={() => {
              onDeleteConfirm();
            }}
          >
            {"Delete"}
          </Button>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

const DeleteButton = {
  backgroundColor: "#f03d30",
};

const BackButton = {
  backgroundColor: "#ECEEF0",
  color: "black",
};
