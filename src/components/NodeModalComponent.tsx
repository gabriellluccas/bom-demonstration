import React, { useContext, useState, useEffect } from "react";
import { useStoreState, removeElements, isNode } from "react-flow-renderer";
import { useHistory } from "react-router-dom";

import { CgTrash } from "react-icons/cg";
import { MainContext, NodeContext } from "../context";
import { InputComponent, ModalComponent } from ".";
import { nodeMounter } from "../utils";

const NodeModalComponent = (): JSX.Element | null => {
  const { elements, setElements } = useContext(MainContext);
  const { node, setNode, showNodeModal, setShowNodeModal } =
    useContext(NodeContext);
  const history = useHistory();
  const nodes = useStoreState((store) => store.nodes);
  const edges = useStoreState((store) => store.edges);

  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => setName(node?.data.label || ""), [node, showNodeModal]);

  const close = () => {
    setName("");
    setError("");
    setShowNodeModal(false);
  };

  const handleDelete = () => {
    if (!node) return;
    const edgesToDelete = edges.filter((edge) => {
      return edge.source === node.id || edge.target === node.id;
    });
    const elementsToDelete = [node, ...edgesToDelete];
    setElements(removeElements(elementsToDelete, elements));
    history.push("/diagram");
    close();
  };

  const handleUpdate = () => {
    return elements.map((element) => {
      const el = element;
      if (isNode(el) && el.id === node?.id) {
        el.data = { ...el.data, label: name };
        setNode(el);
      }
      return el;
    });
  };

  const handleSave = () => {
    const duplicatedName =
      name === node?.id ? false : nodes.some(({ id }) => id === name);
    if (duplicatedName) setError("nameError");
    else {
      setElements(node ? handleUpdate() : [...elements, nodeMounter(name)]);
      close();
    }
  };

  const handleNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setName(evt.target.value);
  };

  return (
    <ModalComponent
      show={showNodeModal}
      title={node ? "editItem" : "addItem"}
      deleteButton={
        node && {
          Icon: CgTrash,
          translationKey: "deleteItem",
          onClick: handleDelete,
        }
      }
      secondaryButton={{ translationKey: "cancel", onClick: close }}
      submitButton={{ disabled: !name, translationKey: "save" }}
      onSubmit={handleSave}
    >
      <InputComponent
        autoFocus
        translationKey="name"
        error={error}
        value={name}
        onChange={handleNameChange}
      />
    </ModalComponent>
  );
};

export default NodeModalComponent;
