import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ExclamationTriangle } from "styled-icons/fa-solid/ExclamationTriangle";

import SceneNode from "@/src/editor/nodes/SceneNode";
import HubsComponentsConfigDialog from "@/src/ui/dialogs/HubsComponentsConfigDialog";
import { DialogContext } from "@/src/ui/contexts/DialogContext";
import { EditorContext } from "@/src/ui/contexts/EditorContext";
import { InfoTooltip } from "@/src/ui/layout/Tooltip";
import { PropertiesPanelButton } from "@/src/ui/inputs/Button";
import theme from "@/src/ui/theme";

const PaddedTooltip = styled(InfoTooltip)`
  padding: 1px 6px;
`;

const ConfigButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  button {
    grid-column-start: 2;
  }
`;

/**
 * Persists our components config on the scene node
 *
 * @typedef Props
 * @property {SceneNode} node
 *
 * @param {Props}
 */
export default function HubsComponentsConfigEditor({ node }) {
  /** @type {import("@/src/editor/Editor").default} */
  const editor = useContext(EditorContext);
  const { showDialog, hideDialog } = useContext(DialogContext);

  const config = node.hubsComponentsConfig;

  /** @param {string} text */
  const save = text => {
    config.setText(text);
    editor.setPropertySelected("hubsComponentsConfig", config);
    hideDialog();
  };
  const close = () => {
    hideDialog();
  };
  const open = () => {
    showDialog(HubsComponentsConfigDialog, {
      title: "default-config.json",
      text: config.text,
      defaultText: config.defaultText,
      onSave: save,
      onCancel: close
    });
  };
  const getOutdatedCount = () => {
    let total = 0;
    editor.nodes.forEach(node => {
      total += node.hubsComponents.value.filter(component => component.needsUpdate()).length;
    });
    return total;
  };
  const outdatedCount = getOutdatedCount();
  const onClickMigrateAll = () => {
    for (const node of editor.nodes) {
      const prevHubsComponentsValue = node.hubsComponents.value;
      node.hubsComponents.value = [];
      for (const component of prevHubsComponentsValue) {
        if (component.needsUpdate()) {
          const newData = component.getDataMigration();
          if (newData) {
            component.data = newData;
            component.config = component.getLatestConfig();
            component.types = component.getLatestDependentTypes();
            node.hubsComponents.value.push(component);
          } else {
            // Don't include the component (delete it)
          }
        } else {
          node.hubsComponents.value.push(component);
        }
      }
      editor.setProperty(node, "hubsComponents", node.hubsComponents, false);
    }
    // Force re-render
    editor.setPropertySelected();
  };
  return (
    <ConfigButtonContainer>
      <PropertiesPanelButton onClick={open}>Edit Components Config</PropertiesPanelButton>
      {outdatedCount > 0 && (
        <PaddedTooltip
          info={`Click to update ${outdatedCount} ${outdatedCount === 1 ? "component" : "components"}`}
          onClick={onClickMigrateAll}
        >
          <ExclamationTriangle size={14} color={theme.text2} />
        </PaddedTooltip>
      )}
    </ConfigButtonContainer>
  );
}

HubsComponentsConfigEditor.propTypes = {
  node: PropTypes.instanceOf(SceneNode).isRequired
};
