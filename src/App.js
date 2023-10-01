import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/TopBar";
import Sidebar from "./scenes/global/SideBar";
import Dashboard from "./scenes/dashboard";
// import Team from "./scenes/team";
// import Invoices from "./scenes/invoices";
// import Bar from "./scenes/bar";
// import Form from "./scenes/form";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";
// import Calendar from "./scenes/calendar";




function App() {

  const [theme, colorMode] = useMode();
  // context objects has a provider and consumer, we are taking input from colormode and then the children can use that input
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <div className="app">
            <Sidebar />
            <main className="content">
              <Topbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                {/* <Route path="/" element={<Team />} /> */}
                {/* <Route path="/" element={<Invoices />} /> */}
                {/* <Route path="/" element={<Bar />} /> */}
                {/* <Route path="/" element={<Form />} /> */}
                {/* <Route path="/" element={<Line />} /> */}
                {/* <Route path="/" element={<Pie />} /> */}
                {/* <Route path="/" element={<FAQ />} /> */}
                {/* <Route path="/" element={<Geography />} /> */}
                {/* <Route path="/" element={<Calendar />} /> */}
              </Routes>
            </main>
          </div>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
