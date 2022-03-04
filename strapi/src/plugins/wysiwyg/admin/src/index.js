import pluginPkg from "../../package.json";
import Wysiwyg from "./components/Wysiwyg";
import Initializer from './components/Initializer';
import pluginId from "./pluginId";

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addFields({ type: 'ck_wysiwyg', Component: Wysiwyg });
    
    app.registerPlugin({
      id: pluginId,
      isReady: true,
      name,
    });
  },
  bootstrap() {},
};