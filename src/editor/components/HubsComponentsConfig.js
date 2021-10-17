import defaultConfigRaw from "@/default-config.json";

/**
 * Utility class for storing the raw and parsed versions of a config
 * file together. This is used because we want to reference the parsed config data
 * in our app logic, but persist the raw string to retain a user's desired formatting.
 */
export default class HubsComponentsConfig {
  /** @type {string} Raw contents of the config file */
  text;

  /** @type {MOZ.Config.Json} Parsed version of the config file */
  json;

  /** @type {string} Default config file text */
  defaultText = defaultConfigRaw;

  /** @param {string} [text] */
  constructor(text) {
    this.setText(text || this.defaultText);
  }

  /** @param {string} text */
  setText(text) {
    this.text = text;
    this.json = JSON.parse(text);
  }

  /** Unique `.nodeName` within the config's "nodes" fields */
  getNodeNames() {
    /** @type {Set<MOZ.Node.Name>} */
    const nodeNames = new Set();
    Object.values(this.json.components || {}).forEach(entry => {
      if (entry.nodes) {
        entry.nodes.forEach(nodeName => nodeNames.add(nodeName));
      }
    });
    return nodeNames;
  }

  hasComponentsForNode(nodeName) {
    // Are there components that can attach to any node (i.e. "node" is set to true)?
    const anyNodeComponents = Object.values(this.json.components).some(componentConfig => componentConfig.node);
    // Are there components that specify this node via their "nodes" array?
    const thisNodeComponents = this.getNodeNames().has(nodeName);

    return anyNodeComponents || thisNodeComponents;
  }
}
