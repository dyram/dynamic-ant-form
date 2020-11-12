import plugin from "js-plugin";
import * as formPresets from "../scripts/formPresets";
import * as fieldPresets from "../scripts/fieldPresets";

plugin.register({
  name: "FormUtilities",
  FormUtilities: {
    ...formPresets,
    ...fieldPresets
  },
  ParserArguments: {
    argumentsObject() {
      return {
        jason: "hi",
        customerName: "jason "
      };
    }
  }
});
