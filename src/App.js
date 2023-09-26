import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/TopBar"
function App() {

  const [theme, colorMode] = useMode();
  return (<ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <div className="app"></div>
        <main className="content">
          <Topbar />
        </main>
      </CssBaseline>
    </ThemeProvider>
  </ColorModeContext.Provider>
  );
}

export default App;
