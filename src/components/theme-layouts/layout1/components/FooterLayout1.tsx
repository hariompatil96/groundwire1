import AppBar from "@mui/material/AppBar";
import { ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { memo } from "react";
import clsx from "clsx";
import { useFooterTheme } from "@fuse/core/FuseSettings/hooks/fuseThemeHooks";
import Link from "next/link";
import { Grid } from "@mui/material";

type FooterLayout1Props = { className?: string };

/**
 * The footer layout 1.
 */
function FooterLayout1(props: FooterLayout1Props) {
  const { className } = props;

  const footerTheme = useFooterTheme();

  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar
        id="fuse-footer"
        className={clsx("relative z-20 border-t", className)}
        color="default"
        sx={(theme) => ({
          backgroundColor: footerTheme.palette.background.default,
          ...theme.applyStyles("light", {
            backgroundColor: footerTheme.palette.background.paper,
          }),
        })}
        elevation={0}
      >
        <Toolbar className="px-8 sm:px-12 py-0 flex items-center overflow-x-auto">
          <Grid container justifyContent={"space-between"}>
            <Grid item>© {new Date().getFullYear()} by Groundwire.net</Grid>
            <Grid item>
              <Link href="/privacy-policy" style={{color:'white !important'}}>Legal and Privacy Policy</Link>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default memo(FooterLayout1);
