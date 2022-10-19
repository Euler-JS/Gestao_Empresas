## To Fix Error of: import org.apache.cordova.CordovaPluginPathHandler;

public class CordovaPluginPathHandler {

    private final WebViewAssetLoader.PathHandler handler;

    public  CordovaPluginPathHandler(WebViewAssetLoader.PathHandler handler) {
        this.handler = handler;
    }

    public WebViewAssetLoader.PathHandler getPathHandler() {
        return handler;
    }
}