import React, { useContext, useState, useEffect } from "react";
import {
  Edge,
  useStoreState,
  Node,
  isEdge,
  removeElements,
} from "react-flow-renderer";
import { useTranslation } from "react-i18next";
import { CgTrash } from "react-icons/cg";

import { InputComponent, ModalComponent } from ".";
import { MainContext } from "../context";
import { nodeById } from "../utils";

const EdgeModalComponent = (): JSX.Element | null => {
  const { t } = useTranslation();
  const { edge, elements, setElements, showEdgeModal, closeEdgeModal } =
    useContext(MainContext);
  const nodes = useStoreState((store) => store.nodes);
  const edges = useStoreState((store) => store.edges);

  const [currentEdge, setCurrentEdge] = useState<Edge>();
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (edge) {
      const fullEdge = edges.find(({ id }) => id === edge?.id) || edge;
      setSource(nodeById(nodes, fullEdge.source)?.data.label);
      setTarget(nodeById(nodes, fullEdge.target)?.data.label);
      setAmount((fullEdge.label as string) || "");
      setCurrentEdge(fullEdge);
    }
  }, [edge]);

  const close = () => {
    setError("");
    setAmount("");
    setSource("");
    setTarget("");
    closeEdgeModal();
  };

  if (!currentEdge) return null;

  const handleDelete = () => {
    setElements(removeElements([currentEdge], elements));
    close();
  };

  const handleSave = () => {
    const updatedElements = elements.map((el) =>
      isEdge(el) && el.id === currentEdge.id ? { ...el, label: amount } : el
    );
    setElements(updatedElements);
    close();
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(evt.target.value);
    setError(parseInt(evt.target.value, 10) <= 0 ? "negativeValueError" : "");
  };

  return (
    <ModalComponent
      show={showEdgeModal}
      title="editConnection"
      onSubmit={handleSave}
      submitButton={{ disabled: !amount || !!error, translationKey: "save" }}
      secondaryButton={{ translationKey: "cancel", onClick: close }}
      deleteButton={{
        Icon: CgTrash,
        translationKey: "deleteConnection",
        onClick: handleDelete,
      }}
    >
      <p className="modal__text">
        ({t("source")}: {source}) {"->"} ({t("target")}: {target})
      </p>
      <InputComponent
        autoFocus
        min={1}
        type="number"
        error={error}
        value={amount}
        onChange={handleChange}
        translationKey="amountNeeded"
      />
    </ModalComponent>
  );
};

export default EdgeModalComponent;
