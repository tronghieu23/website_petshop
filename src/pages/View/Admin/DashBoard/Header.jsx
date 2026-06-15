import { Typography, Box, Avatar, Grid, Paper } from "@mui/material";

const Header = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        backgroundColor: "#0B122A",
        color: "white",
        borderRadius: 2,
      }}
    >
      <Grid container alignItems="center">
        <Grid item xs={12} md={8}>
          <Box display="flex" alignItems="center">
            <Avatar
              alt="Jhon Anderson"
              src="https://randomuser.me/api/portraits/men/41.jpg"
              sx={{ width: 56, height: 56, marginRight: 2 }}
            />
            <Box>
              <Typography variant="h6">Welcome back</Typography>
              <Typography variant="h4" fontWeight="bold">
                Jhon Anderson!
              </Typography>
            </Box>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-around" width="60%">
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                $65.4K
              </Typography>
              <Typography variant="subtitle1">Today Sales</Typography>
              <Box mt={1} display="flex" justifyContent="center">
                <Box
                  width={20}
                  height={5}
                  bgcolor="#FFC1C1"
                  borderRadius={2}
                  mr={1}
                ></Box>
                <Box
                  width={20}
                  height={5}
                  bgcolor="gray"
                  borderRadius={2}
                ></Box>
              </Box>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                78.4%
              </Typography>
              <Typography variant="subtitle1">Growth Rate</Typography>
              <Box mt={1} display="flex" justifyContent="center">
                <Box
                  width={20}
                  height={5}
                  bgcolor="orange"
                  borderRadius={2}
                  mr={1}
                ></Box>
                <Box
                  width={20}
                  height={5}
                  bgcolor="pink"
                  borderRadius={2}
                ></Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4} textAlign="center">
          <img
            src="/path/to/your/image.png"
            alt="Illustration"
            style={{ width: "100%", maxWidth: "200px" }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Header;
